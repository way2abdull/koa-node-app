/* Import external modules */
import { Context } from "koa";
import { STATUS_MSG , ENUM, DBENUMS} from "../../constant";
import { DAOManager } from "../../db/daoManager";
import { AdminV1, AdminEntity } from "../../entity/v1/admin/admin.entity";
import redisDAO from "../../db/redis";
import {
  sendErrorResponse,
  sendSuccess,
  decryptData,
  getJwtToken
} from "../../utils";
import * as utils from "../../utils";
import { IAdminModel } from "../../models/v1/admin.model";

/* Common class encapsulating all the methods */
class SubAdmin {

  async getSubAdminList(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let query: any = ctx.request.query;
      let headers: any = ctx.request.header;
      console.log("-- getSubAdminList CTX --", query, body, headers);
      // let squery = { _id: query.adminId};
      let SubAdminListData: any = await AdminV1.getSubAdminsLists(query);
      if (!SubAdminListData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, SubAdminListData);
      }
      // return STATUS_MSG.SUCCESS.DEFAULT;
    }
    catch (error) {
      console.log("Error in SubAdmin controller api - getSubAdminList Function ", error)
      return error;
    }
  }

  async getSubAdminProfile(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let query: any = ctx.request.query;
      let headers: any = ctx.request.header;
      console.log("-- getSubAdminProfile CTX --", query, body, headers);
      let squery = { _id: query.adminId};
      let userData: any = await AdminV1.getSubAdminInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, userData);
      }
      // return STATUS_MSG.SUCCESS.DEFAULT;
    }
    catch (error) {
      console.log("Error in SubAdmin controller api - getSubAdminProfile Function ", error)
      return error;
    }
  }


  async updateSubAdminProfile(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let headers: any = ctx.request.header;
      console.log("-- updateSubAdminProfile CTX --", body, headers);
      let squery = { _id: body.adminId};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      // let userData: any = await AdminV1.getSubAdminList(squery, {});

      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.USER_NOT_EXIST);
      } else {
        let updatedata = {};
        (body.firstName)? updatedata["firstName"] = body.firstName:"";
        (body.lastName)? updatedata["lastName"] = body.lastName:"";
        (body.phone)? updatedata["phone"] = body.phone:"";
        (body.imageUrl)? updatedata["imageUrl"] = body.imageUrl:"";
        (body.roleId)? updatedata["roleId"] = body.roleId:"";

        let newAdminData = <IAdminModel> await AdminV1.updateSubAdminInfo(squery, updatedata, {new:true, lean:true});
        delete newAdminData.password;

        console.log('----newAdminData----', newAdminData);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.PROFILE_UPDATED, newAdminData);
        
      }
      // return userData;
    }
    catch (error) {
      console.log("Error in SubAdmin controller api - updateSubAdminProfile Function ", error)
      return error;
    }
  }

  async createSubAdmin(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let headers: any = ctx.request.header;
      console.log("-- createSubAdmin CTX --", body, headers);
      let squery = { email: body.email};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      if (userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);
      } else {
        let newAdminData = await AdminV1.createSubAdmin(body);
        console.log('----newAdminData----', newAdminData);
          /** Create User Session */
          const sessionPayload = {
            adminId: newAdminData._id,
            isActive: true,
            lastLogin: Date.now(),
          };
          let sessionResponse = await AdminV1.createAdminSession(sessionPayload);
          await redisDAO
            .createAdminSession(sessionResponse._id, sessionPayload)
            .catch((err) => {
              console.log(err as Error);
            });
          let jwtPayload = {
            sessionId: sessionResponse._id,
            adminId: newAdminData._id,
            timestamp: Date.now(),
          };
          /** Generate Auth Token */
          let jwtToken = await getJwtToken(jwtPayload);
          const data = { ...newAdminData, jwtToken };
          console.log('---after create data -- ', data);
          ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGGED_IN, data);
        
      }
      // return userData;
    }
    catch (error) {
      console.log("Error in SubAdmin controller api - createSubAdmin Function ", error)
      return error;
    }
  }

 

}


export const SubAdminController = new SubAdmin();