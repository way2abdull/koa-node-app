import { User } from "../../../models/v1/user.model";
import { AdminNotification } from "../../../models/v1/adminNotification.model";
import { DBENUMS, COMMON_STATUS } from "../../../constant/appConstants";
import { TemplateUtil } from "../../../utils/templateUtils";
import { BaseEntity } from "../../base.entity";

export class AdminUserEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  async getUsersList(query: any) {
    let pipeline: any = [
      { $match: { status: { $ne: DBENUMS.ACCOUNT_STATUS.DELETED } } },
    ];

    if (query?.status) {
      if (typeof query.status == "string") {
        const status = parseInt(query.status);
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
              mobile: 1,
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
        mobile: 1,
        imageUrl: 1,
        status: 1,
        createdAt: 1,
      },
    });
    return await this.paginateAggregate("User", pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  }

  async getUserDetail(query, projection = {}) {
    let details = await User.findOne(query, projection);
    return details;
  }

  async updateUser(query, upadte) {
    const details = await User.findOneAndUpdate(query, upadte, {
      new: true,
      lean: true,
    });
    return details;
  }

  async userListNotification(userType: string, platform?: string) {
    try {
      let pipeline = [],
        matchCondition = {},
        matchCondition1 = {};

      if (platform == DBENUMS.DEVICE_TYPE.iOS) {
        matchCondition1 = { platform: { $eq: DBENUMS.DEVICE_TYPE.iOS } };
      } else if (platform == DBENUMS.DEVICE_TYPE.ANDROID) {
        matchCondition1 = { platform: { $eq: DBENUMS.DEVICE_TYPE.ANDROID } };
      }

      if (userType === DBENUMS.USER_TYPE.CONFIRM) {
        matchCondition = {};
      } else if (userType === DBENUMS.USER_TYPE.GUEST) {
        matchCondition = {};
      } else if (userType === DBENUMS.USER_TYPE.ALL) {
        matchCondition = {};
      }
      if (userType && platform) {
        pipeline.push(
          { $match: { ...matchCondition } },
          {
            $lookup: {
              from: "usersessions",
              localField: "_id",
              foreignField: "userId",
              as: "sessionData",
              pipeline: [
                { $match: { isActive: { $eq: true }, ...matchCondition1 } },
                {
                  $project: {
                    _id: 0,
                    deviceToken: 1,
                    platform: 1,
                    language: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: { path: "$sessionData" },
          },
          {
            $group: {
              _id: {
                userId: "$_id",
                deviceToken: "$sessionData.deviceToken",
                platform: "$sessionData.platform",
                language: "$sessionData.language",
              },
              userId: { $first: "$_id" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              deviceToken: { $first: "$sessionData.deviceToken" },
              platform: { $first: "$sessionData.platform" },
              language: { $first: "$sessionData.language" },
            },
          },
          {
            $project: {
              _id: 0,
              userId: 1,
              email: 1,
              mobile: 1,
              deviceToken: 1,
              platform: 1,
              language: 1,
            },
          }
        );
      } else {
        pipeline.push(
          { $match: { ...matchCondition } },
          {
            $project: {
              _id: 0,
              userId: 1,
              email: 1,
              mobile: 1,
            },
          }
        );
      }

      const getUserData = await User.aggregate(pipeline);
      return getUserData;
    } catch (error) {
      throw error;
    }
  }
}

export const AdminUserV1 = new AdminUserEntity(User);
