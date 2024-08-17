import { AdminNotification } from "../../../models/v1/adminNotification.model";
import { mailManager } from "../../../utils/mail";
import { pushNotification } from "../../../utils/fcm/fcm.class";
import {
  DBENUMS,
  NOTIFICATION_TYPE,
  COMMON_STATUS,
} from "../../../constant/appConstants";
import { TemplateUtil } from "../../../utils/templateUtils";
import { BaseEntity } from "../../base.entity";
import { AdminUserV1 } from "../admin/user.entity";
import { UserNotificationV1 } from "../user/notification.entity";
import { IAdmin } from "../../../interfaces/admin.interface";

export class AdminNotificationEntity extends BaseEntity {
  constructor(modelName?) {
    super(modelName);
    this.modelName = modelName;
  }

  async createAdminNotification(body) {
    const details = await AdminNotification.create(body);
    return details;
  }

  async findOne(query, projection = {}) {
    const details = await AdminNotification.findOne(query, projection);
    return details;
  }

  async updateNotification(query, upadte) {
    const details = await AdminNotification.findOneAndUpdate(query, upadte, {
      new: true,
      lean: true,
    });
    return details;
  }

  async upadteStatus(query, upadte) {
    const details = await AdminNotification.findOneAndUpdate(query, upadte, {new: true, lean: true});
    return details;
  }

  async getNotificationList(
    query: IAdmin.NotificationPagination
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
          $or: [{ title: { $regex: query.search, $options: "i" } }],
        },
      });
    }
    pipeline.push({
      $sort: { createdAt: -1 },
    });

    pipeline.push({
      $project: {
        title: 1,
        platform: 1,
        smsDescription: 1,
        emailDescription: 1,
        pushDescription: 1,
        image: 1,
        userType: 1,
        users: 1,
        notificationType: 1,
        deliveryStatus: 1,
        createdAt: 1,
      },
    });
    return await this.paginateAggregate("AdminNotification", pipeline, {
      getCount: true,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  }

  async sendAdminNotification(id) {
    try {
      const data: any = await this.findOne({ _id: id });
      await this.updateNotification(
        { deliveryStatus: DBENUMS.NOTIFICATION_STATUS.SENT },
        data.id
      );
      for (let i = 0; i < data.notificationType.length; i++) {
        if (data.notificationType[i] === DBENUMS.ADMIN_NOTIFICATION_TYPE.PUSH) {
          await this.sendPushNotification(data);
        } else if (
          data.notificationType[i] === DBENUMS.ADMIN_NOTIFICATION_TYPE.EMAIL
        ) {
          await this.sendEmailNotification(data);
        } else if (
          data.notificationType[i] === DBENUMS.ADMIN_NOTIFICATION_TYPE.SMS
        ) {
          await this.sendSMSNotification(data);
        }
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendPushNotification(payload) {
    try {
      let payloadData = [];
      const chunkSize = DBENUMS.NOTIFICATION_CHUNK_SIZE;
      if (payload.users.length == 0) {
        const userData = await AdminUserV1.userListNotification(
          payload.userType,
          payload.platform
        );
        for (let i = 0; i < userData.length; i += chunkSize) {
          const chunk = userData.slice(i, i + chunkSize);
          for (let i = 0; i < chunk.length; i++) {
            payloadData.push({
              type: NOTIFICATION_TYPE.ADMIN,
              userId: chunk[i]?.userId,
              title: `${payload?.title}`,
              message: `${payload?.pushDescription}`,
              image: `${payload?.image}`,
              appData: {
                _id: payload?._id?.toString(),
              },
              platform: chunk[i].platform,
              language: chunk[i].language,
            });
            await pushNotification.sendNotificationForAdmin(
              payloadData[i],
              chunk[i].deviceToken
            );
          }
        }
        const uniquePayloadData = Array.from(
          new Map(
            payloadData.map((item) => [item.userId.toString(), item])
          ).values()
        );
        await UserNotificationV1.createMany(uniquePayloadData);
      } else {
        const userIds = payload.users.map((user) => user._id);
        const newData = await UserNotificationV1.fetchUserData(userIds);
        for (let i = 0; i < newData.length; i += chunkSize) {
          const chunk = newData.slice(i, i + chunkSize);
          for (let i = 0; i < chunk.length; i++) {
            payloadData.push({
              type: NOTIFICATION_TYPE.ADMIN,
              userId: chunk[i]?.userId,
              title: `${payload?.title}`,
              message: `${payload?.pushDescription}`,
              image: `${payload?.image}`,
              appData: {
                _id: payload?._id?.toString(),
              },
              platform: chunk[i].platform,
              language: chunk[i].language,
            });
            await pushNotification.sendNotificationForAdmin(
              payloadData[i],
              chunk[i].deviceToken
            );
          }
        }
        const uniquePayloadData = Array.from(
          new Map(
            payloadData.map((item) => [item.toId.toString(), item])
          ).values()
        );
        await UserNotificationV1.createMany(uniquePayloadData);
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async sendEmailNotification(payload) {
    try {
      const emailIds = [];
      if (payload.users.length == 0) {
        const data = await AdminUserV1.userListNotification(payload.userType);
        for (let i = 0; i < data.length; i++) {
          if (data[i].email != "" && data[i].email != null)
            emailIds.push(data[i].email);
        }
      } else {
        for (let i = 0; i < payload.users.length; i++) {
          if (payload.users[i].email != "" && payload.users[i].email != null)
            emailIds.push(payload.users[i].email);
        }
      }
      const mailContent = await new TemplateUtil(
        `${process.cwd()}/src/utils/template/sendOtpUser.html`
      ).compileFile({
        title: payload.title,
        description: payload.emailDescription,
      });
      mailManager.sendBulkMailInviteBCC({
        to: emailIds,
        subject: payload.title,
        html: mailContent,
      });
    } catch (err) {
      throw err;
    }
  }

  async sendSMSNotification(payload) {
    try {
      if (payload.users.length == 0) {
        const data = await AdminUserV1.userListNotification(payload.userType);
        for (let i = 0; i < data.length; i++) {
          console.log("SMS INTEGARTION");
        }
      } else {
        for (let i = 0; i < payload.users.length; i++) {
          console.log("SMS INTEGARTION");
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

export const AdminNotificationV1 = new AdminNotificationEntity(
  AdminNotification
);
