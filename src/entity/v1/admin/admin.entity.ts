import { Admin, IAdminModel } from "../../../models/v1/admin.model";
import {
  AdminSession,
} from "../../../models/v1/adminSession.model";
import { encryptData } from "../../../utils/utils";
import { DBENUMS } from "../../../constant/appConstants";
import { BaseEntity } from "../../base.entity";

export class AdminEntity extends BaseEntity{
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  /**
   * @param payload - get admin info
   */
  async getAdminInfo(query, projection = {}) {
    let details = await Admin.findOne(query, projection);
    return details;
  }


  /**
   * @param payload - get sub admin info
   */
  async getSubAdminInfo(query, projection = {}) {
    let details = await Admin.findOne(query, projection);
    return details;
  }

  /**
   * @param payload - get sub admin List
   */
  async getSubAdminsLists(query: any) {
    let pipeline: any = [
      { $match: { status: { $ne: DBENUMS.ACCOUNT_STATUS.DELETED } } },
    ];

    if (query?.status) {
      if(typeof(query.status) == 'string') {
        const status = parseInt(query.status)
        pipeline.push({ $match: { status: status } });
      } else pipeline.push({ $match: { status: query.status } });
    }

    if (query?.search) {
      pipeline.push({
        $match: {
          $or: [{ fullName: { $regex: query.search, $options: "i" } }],
        },
      });
    }
    if (query?.sortBy && query?.orderBy) {
      if (query?.sortBy === "fullName") {
        pipeline.push(
          {
            $project: {
              firstName: 1,
              lastName: 1,
              fullName: 1,
              email: 1,
              emailVerified: 1,
              phoneVerified: 1,
              isProfileCompleted: 1,
              imageUrl: 1,
              status: 1,
              createdAt: 1,
              _id: 1,
              lowerCaseField: { $toLower: `$${query.sortBy}` },
            },
          },
          {
            $sort: { lowerCaseField: +query.orderBy },
          }
        );
      } else {
        pipeline.push({
          $sort: { [`${query?.sortBy}`]: +query.orderBy },
        });
      }
    } else {
      pipeline.push({
        $sort: { createdAt: -1 },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        fullName: 1,
        email: 1,
        emailVerified: 1,
        phoneVerified: 1,
        isProfileCompleted: 1,
        imageUrl: 1,
        status: 1,
        createdAt: 1,
      },
    });
    return await this.paginateAggregate("Admin", pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  }
  
  /**
   * creates a new user
   * @param payload - user data to insert
   */
  async createSubAdmin(payload: any): Promise<any> {
    if (
      payload?.password &&
      payload.confirmPassword &&
      payload.password == payload.confirmPassword
    ) {
      payload.password = await encryptData(payload.password);
    }
    payload.type = 1;
    payload.roles = 'subadmin';
    let userData = await new this.modelName(payload).save();
    userData = userData.toObject();
    delete userData.password;
    delete userData.updatedAt;
    return userData;
  }

  async createAdminSession(payload: any): Promise<any> {
    let userSessionData = await AdminSession.create(payload);
    return userSessionData;
  }

  async updateAdminInfo(filter, update, option?: any) {
    const details = await Admin.findOneAndUpdate(filter, update, option);
    return details;
  }

  async updateSubAdminInfo(filter, update, option) {
    let details = await Admin.findOneAndUpdate(filter, update, option);
    return details;
  }

  async updateAdminSession(filter: any, update: any) {
    let userSessionData = await AdminSession.findOneAndUpdate(filter, update);
    return userSessionData;
  }

}

export const AdminV1 = new AdminEntity(Admin);
