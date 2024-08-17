import mongoose from "mongoose";
import {
  Maintenencebanner,
  IMaintenencebannerModel,
} from "../../../models/v1/maintenencebanner.model";
import { IAdmin } from "../../../interfaces/admin.interface";
import { COMMON_STATUS } from "../../../constant/appConstants";
import { BaseEntity } from "../../base.entity";

export class MaintenanceBannerEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  /**
   * @param payload - create Maintenencebanner
   */
  async create(
    payload: IMaintenencebannerModel
  ): Promise<IMaintenencebannerModel> {
    return await Maintenencebanner.create(payload);
  }

  async findOne(
    filter: mongoose.FilterQuery<IMaintenencebannerModel>
  ): Promise<IMaintenencebannerModel> {
    return await Maintenencebanner.findOne(filter);
  }

  /**
   * @param payload - update Maintenencebanner info
   */
  async updateBanner(query, payload: Partial<IMaintenencebannerModel>) {
    return await Maintenencebanner.findOneAndUpdate(query, payload, {new: true, lean: true});
  }

  async updateMany(query, payload: Partial<IMaintenencebannerModel>) {
    await Maintenencebanner.updateMany(query, payload);
  }

  async getBannerList(
    query: IAdmin.VersionsPagination
  ): Promise<IAdmin.PaginationResult> {
    let pipeline: any = [
      { $match: { status: { $ne: COMMON_STATUS.DELETED } } },
    ];

    if (query?.status) {
      pipeline.push({ $match: { status: query.status } });
    }

    if (query?.search) {
      pipeline.push({
        $match: {
          $or: [{ name: { $regex: query.search, $options: "i" } }],
        },
      });
    }
    if (query?.sortBy && query?.orderBy) {
      if (query?.sortBy === "name") {
        pipeline.push(
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              order: 1,
              image: 1,
              redirection: 1,
              redirectionUrl: 1,
              page: 1,
              status: 1,
              createdAt: 1,
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
        name: 1,
        description: 1,
        order: 1,
        image: 1,
        redirection: 1,
        redirectionUrl: 1,
        page: 1,
        status: 1,
        createdAt: 1,
      },
    });
    return await this.paginateAggregate("Maintenencebanner", pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  }
}

export const MaintenanceBannerV1 = new MaintenanceBannerEntity(Maintenencebanner);
