import { Context } from "koa";
import { VersionV1 } from "../../entity/v1/admin/version.entity";
import { sendErrorResponse, sendSuccess } from "../../utils";
import { STATUS_MSG } from "../../constant/appConstants";
import * as utils from "../../utils";
import { IVersionModel } from "../../models/v1/version.model";

class VersionClass {
  async addVersion(ctx: Context) {
    try {
      let body: IVersionModel = ctx.request.body as IVersionModel;
      const existingVersion = await VersionV1.findOneVersion({
        platform: body.platform,
        $or: [
          {
            name: body.name,
          },
          {
            version: body.version,
          },
        ],
      });
      if (!existingVersion) {
        if (body.isCurrentVersion) {
          await VersionV1.updateMany(
            { platform: body.platform },
            { isCurrentVersion: false }
          );
        }
        const versionData = await VersionV1.createVersion(body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.VERSION_CREATED, versionData);
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_VERSION);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getVersions(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await VersionV1.getVersionList(query);
      if(data){
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.VERSION_FETCHED, data);
      } else ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DATA_NOT_FOUND, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getVersionById(ctx: Context) {
    try {
      let id = ctx.params.id;
      const data = await VersionV1.findOneVersion({ _id: id });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.VERSION_FETCHED, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateVersion(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let id = ctx.params.id;
      const versionExist = await VersionV1.findOneVersion({ _id: id });
      if (!versionExist) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.CUSTOM_ERROR("Version doesn't exist.")
        ));
      }
      const existingVersion = await VersionV1.findOneVersion({
        platform: versionExist.platform,
        name: body.name,
        _id: {
          $ne: id,
        },
      });

      if (!existingVersion) {
        if (body?.isCurrentVersion) {
          const latestVersion = await VersionV1.findOneVersion({
            platform: versionExist.platform,
            isCurrentVersion: true,
          });
          if (latestVersion) {
            const result = utils.compareVersions(
              versionExist.version,
              latestVersion.version
            );
            if (result < 0) {
              return (ctx.body = sendErrorResponse(
                ctx,
                STATUS_MSG.ERROR.CUSTOM_ERROR(
                  "Given version should be greater than current version."
                )
              ));
            }
          }
        }

        await VersionV1.updateVersion({ _id: id }, body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.VERSION_UPDATED, {});
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_VERSION);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateVersionStatus(ctx: Context) {
    try {
      let id = ctx.params.id;
      let query: any = ctx.request.body;
      await VersionV1.updateVersion({ _id: id }, { status: query.status });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.VERSION_UPDATED, {});
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }
}

export const VersionController = new VersionClass();
