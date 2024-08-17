import mongoose from "mongoose";
import { StaticContent, IStaticManagementModel } from "../../../models/v1/staticContent.model";
import { IAdmin } from "../../../interfaces/admin.interface";
import { BaseEntity } from '../../base.entity';

export class ContentEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  /**
   * @param payload - create content
   */
  async createContent(payload: IStaticManagementModel): Promise<IStaticManagementModel> {
    return await StaticContent.create(payload);
  }

  async findOne(filter: mongoose.FilterQuery<IStaticManagementModel>): Promise<IStaticManagementModel> {
    return await StaticContent.findOne(filter);
  }

  /**
   * @param payload - get StaticContent list
   */
  async getContent(query: IAdmin.ContentPagination): Promise<IStaticManagementModel[]> {
    let pipeline: any = [{ $match: {} }];

    if (query?.contentType) {
      pipeline.push({ $match: { contentType: query.contentType } });
    }

    if (query?.status) {
      pipeline.push({ $match: { status: query.status } });
    }

    if (query?.search) {
      pipeline.push({
        $match: {
          name: { $regex: query.search, $options: 'i' }
        }
      });
    }
    let data = await StaticContent.aggregate(pipeline);
    return data;
  }

  /**
   * @param payload - update StaticContent info
   */
  async updateOne(query, payload) {
    return await StaticContent.findOneAndUpdate(query, payload, {new: true, lean: true});
  }

  async findContentById(id) {
    return await StaticContent.findById(id);
  }

  async deleteContent(id) {
    return await StaticContent.deleteOne(id);
  }


}

export const StaticContentV1 = new ContentEntity(StaticContent);
