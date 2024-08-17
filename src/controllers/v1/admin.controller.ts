/* Import external modules */
import { Context } from "koa";
import { STATUS_MSG , ENUM, DBENUMS} from "../../constant";
import { AdminV1 } from "../../entity/v1/admin/admin.entity";
import { AdminUserV1 } from "../../entity/v1/admin/user.entity";
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
class Admin {

  async LoginAdmin(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let headers: any = ctx.request.header;
      console.log("-- LoginAdmin CTX --", body, headers);
      let squery = { email: body.email};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        let check = await decryptData(body.password, userData.password);
        if (!check) {
          ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_PASSWORD);
        } else {
          if (userData.status === DBENUMS.ACCOUNT_STATUS.BLOCKED) {
            return (ctx.body = sendErrorResponse(
              ctx,
              STATUS_MSG.ERROR.USER_ACCOUNT_BLOCKED
            ));
          }
          /** Create User Session */
          const sessionPayload = {
            adminId: userData._id,
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
            adminId: userData._id,
            timestamp: Date.now(),
          };
          /** Generate Auth Token */
          let jwtToken = await getJwtToken(jwtPayload);
          const data = { ...userData._doc, jwtToken };
          ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGGED_IN, data);
        }
      }
      // return userData;
    }
    catch (error) {
      console.log("Error in Admin controller api - LoginAdmin Function ", error)
      return error;
    }
  }


  async forgetAdminPassword(ctx: Context) {
    try {
      return STATUS_MSG.SUCCESS.CREATED;
    }
    catch (error) {
      console.log("Error in Admin controller api - forgetAdminPassword Function ", error)
      return error;
    }
  }


  async resetAdminPassword(ctx: Context) {
    try {
      return STATUS_MSG.SUCCESS.CREATED;
    }
    catch (error) {
      console.log("Error in Admin controller api - resetAdminPassword Function ", error)
      return error;
    }
  }


  async verifyAdminResetPasswordToken(ctx: Context) {
    try {
      return STATUS_MSG.SUCCESS.CREATED;
    }
    catch (error) {
      console.log("Error in Admin controller api - verifyAdminResetPasswordToken Function ", error)
      return error;
    }
  }


  async getAdminProfile(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let query: any = ctx.request.query;
      let headers: any = ctx.request.header;
      console.log("-- getAdminProfile CTX --", query, body, headers);
      let squery = { _id: query.adminId};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, userData);
      }
      // return STATUS_MSG.SUCCESS.DEFAULT;
    }
    catch (error) {
      console.log("Error in Admin controller api - getAdminProfile Function ", error)
      return error;
    }
  }


  async updateAdminProfile(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let headers: any = ctx.request.header;
      console.log("-- updateAdminProfile CTX --", body, headers);
      let squery = { _id: body.adminId};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.USER_NOT_EXIST);
      } else {
        let updatedata = {};
        (body.firstName)? updatedata["firstName"] = body.firstName:"";
        (body.lastName)? updatedata["lastName"] = body.lastName:"";
        (body.phone)? updatedata["phone"] = body.phone:"";

        let newAdminData = <IAdminModel> await AdminV1.updateAdminInfo(squery, updatedata, {new:true, lean:true});
        delete newAdminData.password;

        console.log('----newAdminData----', newAdminData);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.PROFILE_UPDATED, newAdminData);
        
      }
      // return userData;
    }
    catch (error) {
      console.log("Error in Admin controller api - updateAdminProfile Function ", error)
      return error;
    }
  }

  async logoutAdmin(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let query: any = ctx.request.query;
      let headers: any = ctx.request.header;
      console.log("-- logoutAdmin CTX --", query, body, headers);
      let adminId = body.adminId;

      // let sessionId = body.sessionId;
      // let adminSessionData = await redisDAO.findAdminSession(sessionId);
      // let adminId = adminSessionData.adminId;
      
      let squery = { _id: adminId};
      let userData: any = await AdminV1.getAdminInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        const adminSession = await AdminV1.updateAdminSession({userId:adminId, isActive: true}, {isActive: false});
        await redisDAO.delAdminSession(adminSession._id);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, userData);
      }
      // return STATUS_MSG.SUCCESS.DEFAULT;
    }
    catch (error) {
      console.log("Error in Admin controller api - getAdminProfile Function ", error)
      return error;
    }
  }

  // async createSubAdmin(ctx: Context) {
  //   try {
  //     let body: any = ctx.request.body;
  //     let headers: any = ctx.request.header;
  //     console.log("-- createSubAdmin CTX --", body, headers);
  //     let squery = { email: body.email};
  //     let userData: any = await AdminV1.getAdminInfo(squery, {});
  //     if (userData) {
  //       ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);
  //     } else {
  //       let newAdminData = await AdminV1.createSubAdmin(body);
  //       console.log('----newAdminData----', newAdminData);
  //         /** Create User Session */
  //         const sessionPayload = {
  //           adminId: newAdminData._id,
  //           isActive: true,
  //           lastLogin: Date.now(),
  //         };
  //         let sessionResponse = await AdminV1.createAdminSession(sessionPayload);
  //         await redisDAO
  //           .createAdminSession(sessionResponse._id, sessionPayload)
  //           .catch((err) => {
  //             console.log(err as Error);
  //           });
  //         let jwtPayload = {
  //           sessionId: sessionResponse._id,
  //           adminId: newAdminData._id,
  //           timestamp: Date.now(),
  //         };
  //         /** Generate Auth Token */
  //         let jwtToken = await getJwtToken(jwtPayload);
  //         const data = { ...newAdminData, jwtToken };
  //         console.log('---after create data -- ', data);
  //         ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGGED_IN, data);
        
  //     }
  //     // return userData;
  //   }
  //   catch (error) {
  //     console.log("Error in Admin controller api - createSubAdmin Function ", error)
  //     return error;
  //   }
  // }

  async getUsersList(ctx: Context) {
    try {
      let query: any = ctx.request.query;
      const data = await AdminUserV1.getUsersList(query);
      if(data){
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.USERS_LIST_FETCHED, data);
      } else ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DATA_NOT_FOUND, data);
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async getUserDetail(ctx: Context) {
    try {
      const params: any = ctx.params;
      const squery = { _id: params.id };
      const userData: any = await AdminUserV1.getUserDetail(squery, {});
      if (!userData) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.INVALID_USER_ID
        ));
      } else {
        return (ctx.body = sendSuccess(STATUS_MSG.SUCCESS.USERS_DETAILS_FETCHED, userData));
      }
    } catch (error) {
      console.log(
        "Error in User controller api - getUserDetail Function ",
        error
      );
      return error;
    }
  }

}


export const AdminController = new Admin();