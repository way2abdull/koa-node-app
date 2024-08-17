/* Import external modules */
import { Context } from "koa";
import { STATUS_MSG, DBENUMS, COMMON_STATUS } from "../../constant";
import { sendSuccess, sendErrorResponse } from "../../utils/utils";
import { MODULE } from "../../constant/models.constant";
import { AdminV1 } from "../../entity/v1/admin/admin.entity";
import { AdminUserV1 } from "../../entity/v1/admin/user.entity";
import { BannerV1 } from "../../entity/v1/admin/banner.entity";
import { StaticContentV1 } from "../../entity/v1/admin/content.entity";
import { MaintenanceBannerV1 } from "../../entity/v1/admin/maintenanceBanner.entity";
import { AdminNotificationV1 } from "../../entity/v1/admin/notification.entity";
import { RolesV1 } from "../../entity/v1/admin/roles.entity";
import { VersionV1 } from "../../entity/v1/admin/version.entity";

/* Common class encapsulating all the methods */
class Common {
  async getCreds(ctx: Context) {
    try {
      return STATUS_MSG.SUCCESS.DEFAULT;
    } catch (error) {
      console.log("Error in common controller api - getCreds  Function", error);
      return error;
    }
  }

  async upadteStatus(ctx: Context) {
    try {
      let params: any = ctx.params;
      const squery = { _id: params.id };
      const body: any = ctx.request.body;
      let data: any;

      switch (body.module) {
        case MODULE.USER:
          data = await AdminUserV1.updateUser(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.USER_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.USER_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.ADMIN:
          data = await AdminV1.updateAdminInfo(
            squery,
            { status: body.status },
            { new: true, lean: true }
          );
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.ADMIN_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.ADMIN_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.BANNER:
          data = await BannerV1.updateBanner(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.BANNER_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.BANNER_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.VERSION:
          data = await VersionV1.updateVersion(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.VERSION_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.VERSION_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.STATIC_CONTENT:
          data = await StaticContentV1.updateOne(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.CONTENT_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.CONTENT_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.ROLES:
          data = await RolesV1.updateRoles(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.ROLE_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.ROLE_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.MAINTENANCE_BANNER:
          data = await MaintenanceBannerV1.updateBanner(squery, {
            status: body.status,
          });
          if (data.status == COMMON_STATUS.ACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_ACTIVATED,
              data
            ));
          } else if (data.status == COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_DEACTIVATED,
              data
            ));
          }
          break;
        case MODULE.ADMIN_NOTIFICATION:
          data = await AdminNotificationV1.updateNotification(squery, {
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
          }
          break;
        default:
          console.log("Module not found!");
      }
    } catch (error) {
      return sendErrorResponse(ctx, error);
    }
  }

  async upadteUserStatus(ctx: Context) {
    try {
      let params: any = ctx.params;
      const squery = { _id: params.id };
      const body: any = ctx.request.body;
      let data: any;

      switch (body.module) {
        case "":
          data = {};
            return data;
          // break;
        default:
          console.log("Module not found!");
      }
    } catch (error) {
      return sendErrorResponse(ctx, error);
    }
  }

  async uploadImage(ctx: Context) {
    try {
      return STATUS_MSG.SUCCESS.DEFAULT;
    } catch (error) {
      console.log(
        "Error in common controller api - uploadImage function ",
        error
      );
      return error;
    }
  }
}

export const CommonController = new Common();
