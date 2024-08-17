import { Context } from "koa";
import { RolesV1 } from "../../entity/v1/admin/roles.entity";
import { sendErrorResponse, sendSuccess } from "../../utils";
import { STATUS_MSG } from "../../constant/appConstants";
import * as utils from "../../utils";
import { IRoleModel } from "../../models/v1/role.model";

class RolesClass {
  async addRoles(ctx: Context) {
    try {
      let body: IRoleModel = ctx.request.body as IRoleModel;
      const existingRoles = await RolesV1.findOneRoles({ name: body.name });
      if (!existingRoles) {
        await RolesV1.createRoles(body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.ROLES_CREATED, {});
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_ROLES);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getRoless(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await RolesV1.getRolesList(query);
      if(data){
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.ROLES_FETCHED, data);
      } else ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DATA_NOT_FOUND, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getRolesById(ctx: Context) {
    try {
      let id = ctx.params.id;
      const data = await RolesV1.findOneRoles({ _id: id });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.ROLES_FETCHED, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateRoles(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let id = ctx.params.id;
      const RolesExist = await RolesV1.findOneRoles({ _id: id });
      if (!RolesExist) {
        return (ctx.body = sendErrorResponse( ctx, STATUS_MSG.ERROR.CUSTOM_ERROR("Roles doesn't exist.") ));
      }
      const existingRoles = await RolesV1.findOneRoles({ name: body.name, _id: { $ne: id, },  });

      if (!existingRoles) {
        await RolesV1.updateRoles({ _id: id }, body);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.ROLES_UPDATED, {});
      } else {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DUPLICATE_ROLES);
      }
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async updateRolesStatus(ctx: Context) {
    try {
      let id = ctx.params.id;
      let query: any = ctx.request.body;
      await RolesV1.updateRoles({ _id: id }, { status: query.status });
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.ROLES_UPDATED, {});
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }
}

export const RolesController = new RolesClass();
