import mongoose from "mongoose";
import { Roles, IRoleModel } from "../../../models/v1/role.model";
import { IAdmin } from "../../../interfaces/admin.interface";
import { BaseEntity } from '../../base.entity';
import { COMMON_STATUS } from "../../../constant";

export class RolesEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  /**
   * @param payload - create Roles
   */
  async createRoles(payload: IRoleModel): Promise<IRoleModel> {
    return await Roles.create(payload);
  }

  async findOneRoles(filter: mongoose.FilterQuery<IRoleModel>): Promise<IRoleModel> {
    return await Roles.findOne(filter);
  }

  /**
   * @param payload - update Roles info
   */
  async updateRoles(query, payload: Partial<IRoleModel>) {
    return await Roles.updateOne(query, payload, {new: true, lean: true});
  }

  async updateMany(query, payload: Partial<IRoleModel>) {
    await Roles.updateMany(query, payload);
  }

  async getRolesList(query: IAdmin.RolesPagination): Promise<IAdmin.PaginationResult> {
    let pipeline: any = [{ $match: { status: { $ne: COMMON_STATUS.DELETED } } }];

    if (query?.status) {
      pipeline.push({ $match: { status: query.status } });
    }

    if (query?.search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
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
              description: 1,
              allowedmoduels :1,
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
        status: 1,
        description: 1,
        allowedmoduels: 1,
        createdAt: 1,
      }
    });
    return await this.paginateAggregate('Roles', pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit)
    });
  }


}

export const RolesV1 = new RolesEntity(Roles);
