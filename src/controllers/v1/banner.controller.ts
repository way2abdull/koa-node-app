import { Context } from "koa";
import { BannerV1 } from "../../entity/v1/admin/banner.entity";
import { sendErrorResponse, sendSuccess } from "../../utils";
import { STATUS_MSG, COMMON_STATUS } from "../../constant/appConstants";
import * as utils from "../../utils";
import { IBannerModel } from "../../models/v1/banner.model";

class BannerClass {
  async addBanner(ctx: Context) {
    try {
      console.log("hello")
      let body: IBannerModel = ctx.request.body as IBannerModel;
      const existingBanner = await BannerV1.findOne({ name: body.name });
      if (!existingBanner) {
        const bannerData = await BannerV1.create(body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.BANNER_CREATED, bannerData);
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_BANNER);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getBanners(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await BannerV1.getBannerList(query);
      if (data) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.BANNER_FETCHED, data);
      } else ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DATA_NOT_FOUND, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getVersionById(ctx: Context) {
    try {
      let id = ctx.params.id;
      const data = await BannerV1.findOne({ _id: id });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.BANNER_FETCHED, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateBanner(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let id = ctx.params.id;
      const bannerExist = await BannerV1.findOne({ _id: id });
      if (!bannerExist) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.CUSTOM_ERROR("Banner doesn't exist.")
        ));
      } else {
        if (bannerExist.name === body.name.toLowerCase()) {
          const bannerData = await BannerV1.updateBanner({ _id: id }, body);
          ctx.body = sendSuccess(
            STATUS_MSG.SUCCESS.MAINTENANCE_BANNER_UPDATED,
            bannerData
          );
        } else {
          const existingBanner = await BannerV1.findOne({ name: body.name });
          if (!existingBanner) {
            const bannerData = await BannerV1.updateBanner({ _id: id }, body);
            ctx.body = sendSuccess(
              STATUS_MSG.SUCCESS.BANNER_UPDATED,
              bannerData
            );
          } else {
            ctx.body = sendErrorResponse(
              ctx,
              STATUS_MSG.ERROR.DUPLICATE_BANNER
            );
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
      const bannerData = await BannerV1.updateBanner(
        { _id: id },
        { status: query.status }
      );
      if (bannerData.status == COMMON_STATUS.ACTIVE) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.BANNER_ACTIVATED, bannerData);
      } else if (bannerData.status == COMMON_STATUS.INACTIVE) {
        ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.BANNER_DEACTIVATED,
          bannerData
        );
      } else if (bannerData.status == COMMON_STATUS.DELETED) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.BANNER_DELETED, bannerData);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }
}

export const BannerController = new BannerClass();
