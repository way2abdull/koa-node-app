import { Context } from "koa";
import { MaintenanceBannerV1 } from "../../entity/v1/admin/maintenanceBanner.entity";
import { sendErrorResponse, sendSuccess } from "../../utils";
import { STATUS_MSG, COMMON_STATUS } from "../../constant/appConstants";
import * as utils from "../../utils";
import { IMaintenencebannerModel } from "../../models/v1/maintenencebanner.model";

class MaintenanceBannerClass {
  async addBanner(ctx: Context) {
    try {
      let body: IMaintenencebannerModel = ctx.request
        .body as IMaintenencebannerModel;
      const existingBanner = await MaintenanceBannerV1.findOne({ name: body.name });
      if (!existingBanner) {
        const bannerData = await MaintenanceBannerV1.create(body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_CREATED, bannerData);
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_MAINTENANCE_BANNER);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getBanners(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await MaintenanceBannerV1.getBannerList(query);
      if (data) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_FETCHED, data);
      } else ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DATA_NOT_FOUND, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getBannerById(ctx: Context) {
    try {
      let id = ctx.params.id;
      const data = await MaintenanceBannerV1.findOne({ _id: id });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_FETCHED, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateBanner(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let id = ctx.params.id;
      const bannerExist = await MaintenanceBannerV1.findOne({ _id: id });
      if (!bannerExist) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.CUSTOM_ERROR("Banner doesn't exist.")
        ));
      } else {
        if(bannerExist.name == body.name.toLowerCase()) {
          const bannerData = await MaintenanceBannerV1.updateBanner({ _id: id }, body);
          ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_UPDATED, bannerData);
        } else {
          const existingBanner = await MaintenanceBannerV1.findOne({ name: body.name });
          if (!existingBanner) {
            const bannerData = await MaintenanceBannerV1.updateBanner({ _id: id }, body);
            ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_UPDATED, bannerData);
          } else {
            ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_MAINTENANCE_BANNER);
          }
        }
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateBannerStatus(ctx: Context) {
    try {
      let id = ctx.params.id;
      let query: any = ctx.request.body;
      const bannerData = await MaintenanceBannerV1.updateBanner({ _id: id }, { status: query.status });
      if(bannerData.status == COMMON_STATUS.ACTIVE) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_ACTIVATED, bannerData);
      } else if (bannerData.status == COMMON_STATUS.INACTIVE) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_DEACTIVATED, bannerData);
      } else if (bannerData.status == COMMON_STATUS.DELETED) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_DELETED, bannerData);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }
}

export const MaintenanceBannerController = new MaintenanceBannerClass();
