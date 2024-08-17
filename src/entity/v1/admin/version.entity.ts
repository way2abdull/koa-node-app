import mongoose from "mongoose";
import { Version, IVersionModel } from "../../../models/v1/version.model";
import { IAdmin } from "../../../interfaces/admin.interface";
import { COMMON_STATUS } from '../../../constant/appConstants';
import { BaseEntity } from '../../base.entity';

export class VersionEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  /**
   * @param payload - create version
   */
  async createVersion(payload: IVersionModel): Promise<IVersionModel> {
    return await Version.create(payload);
  }

  async findOneVersion(filter: mongoose.FilterQuery<IVersionModel>): Promise<IVersionModel> {
    return await Version.findOne(filter);
  }

  /**
   * @param payload - update version info
   */
  async updateVersion(query, payload: Partial<IVersionModel>) {
    return await Version.updateOne(query, payload, {new: true, lean: true});
  }

  async updateMany(query, payload: Partial<IVersionModel>) {
    await Version.updateMany(query, payload);
  }

  async getVersionList(query: IAdmin.VersionsPagination): Promise<IAdmin.PaginationResult> {
    let pipeline: any = [{ $match: { status: { $ne: COMMON_STATUS.DELETED } } }];

    if (query?.status) {
      pipeline.push({ $match: { status: query.status } });
    }

    if (query?.search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { version: { $regex: query.search, $options: 'i' } }
          ]
        }
      });
    }
    if (query?.sortBy && query?.orderBy) {
      if (query?.sortBy === 'name') {
        pipeline.push(
          {
            $project: {
              name: 1,
              updateType: 1,
              platform: 1,
              version: 1,
              description: 1,
              isCurrentVersion: 1,
              status: 1,
              createdAt: 1,
              _id: 1,
              lowerCaseField: { $toLower: `$${query.sortBy}` }
            }
          },
          {
            $sort: { lowerCaseField: +query.orderBy }
          }
        );
      } else {
        pipeline.push({
          $sort: { [`${query?.sortBy}`]: +query.orderBy }
        });
      }
    } else {
      pipeline.push({
        $sort: { createdAt: -1 }
      });
    }

    pipeline.push({
      $project: {
        name: 1,
        updateType: 1,
        platform: 1,
        version: 1,
        status: 1,
        description: 1,
        isCurrentVersion: 1,
        createdAt: 1,
      }
    });
    return await this.paginateAggregate('Version', pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit)
    });
  }


}

export const VersionV1 = new VersionEntity(Version);
