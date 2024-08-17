import { Context } from "koa";
import { STATUS_MSG, DBENUMS, COMMON_STATUS } from "../../constant/appConstants";
import { AdminNotificationV1 } from "../../entity/v1/admin/notification.entity";
import {
  sendErrorResponse,
  sendSuccess,
} from "../../utils";
import * as utils from "../../utils";

class AdminNotification {
  async createAdminNotification(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      const existingNotif = await AdminNotificationV1.findOne({
        title: body.title,
      });
      if (!existingNotif) {
        const notifData = await AdminNotificationV1.createAdminNotification(
          body
        );
        if (notifData.deliveryStatus === DBENUMS.NOTIFICATION_STATUS.SENT) {
          const id = notifData._id;
          await AdminNotificationV1.sendAdminNotification(id);
        }
        ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.NOTIFICATION_CREATED,
          notifData
        );
      } else {
        ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.DUPLICATE_NOTIFICATION
        );
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async sendAdminNotification(ctx: Context) {
    try {
      const params: any = ctx.params;
      const data = await AdminNotificationV1.findOne({
        _id: params.id,
      });
      if (!data) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_CONTENT_ID);
      } else await AdminNotificationV1.sendAdminNotification(params.id);
      return (ctx.body = sendSuccess(STATUS_MSG.SUCCESS.NOTIFICATION_SENT, {}));
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getNotificationList(ctx: Context) {
    try {
      const query: any = ctx.request.query;
      const data = await AdminNotificationV1.getNotificationList(query);
      return (ctx.body = sendSuccess(
        STATUS_MSG.SUCCESS.NOTIFICATION_FETCHED,
        data
      ));
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getNotificationDetails(ctx: Context) {
    try {
      const params: any = ctx.params;
      const data = await AdminNotificationV1.findOne({
        _id: params.id,
      });
      return (ctx.body = sendSuccess(
        STATUS_MSG.SUCCESS.NOTIFICATION_FETCHED,
        data
      ));
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateNotificationDetails(ctx: Context) {
    try {
      const params: any = ctx.params;
      const body: any = ctx.request.body;
      const notifExist = await AdminNotificationV1.findOne({ _id: params.id });
      if (!notifExist) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.CUSTOM_ERROR("Notification doesn't exist.")
        ));
      } else {
        if (notifExist.title.toLowerCase() === body.title.toLowerCase()) {
          const notifData = await AdminNotificationV1.updateNotification(
            { _id: params.id },
            body
          );
          ctx.body = sendSuccess(
            STATUS_MSG.SUCCESS.NOTIFICATION_UPDATED,
            notifData
          );
        } else {
          const existingNotif = await AdminNotificationV1.findOne({
            title: body.title,
          });
          if (!existingNotif) {
            const notifData = await AdminNotificationV1.updateNotification(
              { _id: params.id },
              body
            );
            ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.NOTIFICATION_UPDATED,
              notifData
            );
          } else {
            ctx.body = sendErrorResponse(
              ctx,
              STATUS_MSG.ERROR.DUPLICATE_NOTIFICATION
            );
          }
        }
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async upadteNotificationStatus(ctx: Context) {
    try {
      let params: any = ctx.params;
      const squery = { _id: params.id };
      const body: any = ctx.request.body;
      const data = await AdminNotificationV1.upadteStatus(squery, {
        status: body.status,
      });
      if (data.status == COMMON_STATUS.ACTIVE) {
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.NOTIFICATION_ACTIVATED,
          data
        ));
      } else if (data.status == COMMON_STATUS.INACTIVE) {
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.NOTIFICATION_DEACTIVATED,
          data
        ));
      } else if (data.status == COMMON_STATUS.DELETED) {
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.NOTIFICATION_DELETED,
          data
        ));
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

}

export const AdminNotificationController = new AdminNotification();