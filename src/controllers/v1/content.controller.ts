import { Context } from "koa";
import { StaticContentV1 } from "../../entity/v1/admin/content.entity";
import { sendErrorResponse, sendSuccess } from "../../utils";
import { STATUS_MSG, DBENUMS } from "../../constant/appConstants";
import * as utils from "../../utils";

class Content {
  async addContent(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      const existingContent = await StaticContentV1.findOne({
        contentType: body.contentType,
        language: body.language,
        status: DBENUMS.STATUS[0],
      });
      if (!existingContent) {
        const contentData = await StaticContentV1.createContent(body);
        ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.CONTENT_CREATED(
            body.contentType.split("_").join(" ")
          ),
          contentData
        );
      } else {
        ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.CONTENT_ALREADY_EXIST
        );
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getContent(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await StaticContentV1.getContent(query);
      if (data) {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.CONTENT_LIST_FETCHED, data);
      } else ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DATA_NOT_FOUND);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getContentById(ctx: Context) {
    try {
      const params: any = ctx.params;
      const data = await StaticContentV1.findContentById(params.id);
      if (!data) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_CONTENT_ID);
      } else {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.CONTENT_LIST_FETCHED, data);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateContent(ctx: Context) {
    try {
      const params: any = ctx.params;
      const body: any = ctx.request.body;
      let data = await StaticContentV1.findContentById(params.id);
      if (data) {
        const updatedData = await StaticContentV1.updateOne(
          { _id: params.id },
          body
        );
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.CONTENT_UPDATED(
            updatedData.contentType.split("_").join(" ")
          ),
          updatedData
        ));
      } return (ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_CONTENT_ID));
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async removeContent(ctx: Context) {
    try {
      let params: any = ctx.params;
      let contentInfo = await StaticContentV1.findContentById(params.id);
      if (!contentInfo) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_CONTENT_ID);
      } else {
        await StaticContentV1.deleteContent({ _id: params.id });
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.CONTENT_REMOVE, {});
      }
    } catch (error) {
      console.log("Error in CONTENT controller api", error);
      return error;
    }
  }
}

export const ContentController = new Content();
