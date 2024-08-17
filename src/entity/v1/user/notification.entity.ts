import * as Services from "../../../db/daoManager";
import mongoose from "mongoose";
import { UserNotification } from "../../../models/v1/userNotification.model";
import { UserSession } from "../../../models/v1/userSession.model";

export class UserNotificationEntity {
  public ObjectId = mongoose.Types.ObjectId;
  public DAOManager: any = new Services.DAOManager();
  protected modelName: ModelNames | any;
  constructor(modelName?) {
    this.modelName = modelName;
  }

  async create(payload) {
    const details = await UserNotification.create(payload);
    return details;
  }

  async createMany(payload) {
    if (payload.length > 0) {
      const details = await UserNotification.insertMany(payload);
      return details;
    } else return;
  }

  async getNotification(query, projection = {}) {
    const details = await UserNotification.find(query, projection);
    return details;
  }

  async fetchUserData(userIds): Promise<any> {
    try {
      return await UserSession.aggregate([
        {
          $match: {
            userId: { $in: userIds },
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                },
              },
            ],
          },
        },
        { $unwind: "$userId" },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              userId: "$userId._id",
              deviceToken: "$deviceToken",
              platform: "$platform",
              language: "$language",
            },
            userId: { $first: "$userId" },
            deviceToken: { $first: "$deviceToken" },
            platform: { $first: "$platform" },
            language: { $first: "$language" },
          },
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            deviceToken: 1,
            platform: 1,
            language: 1,
          },
        },
      ]).exec();
    } catch (err) {
      throw err;
    }
  }
}

export const UserNotificationV1 = new UserNotificationEntity(UserNotification);
