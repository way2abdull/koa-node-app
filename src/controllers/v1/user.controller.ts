import { Context } from "koa";
import { STATUS_MSG, COMMON_STATUS, DBENUMS } from "../../constant";
import { UserV1 } from "../../entity/v1/user/user.entity";
import redisDAO from "../../db/redis";
import {
  sendErrorResponse,
  sendSuccess,
  decryptData,
  encryptData,
  getJwtToken,
  generateOtp,
  getOtpExpiryTime,
} from "../../utils";
import * as utils from "../../utils";
import moment = require("moment");
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TYPE,
} from "../../constant/appConstants";
import { pushNotification } from "../../utils/fcm/fcm.class";
import { smsNotify } from '../../utils/sms/sms.util';
import { ICommonInterface } from "../../interfaces/common.interface";
class User {
  async LoginUser(ctx: Context) {
    try {
      let body: any = ctx.request.body;
      let headers: any = ctx.request.header;
      console.log("-- LoginUser CTX --", body, headers);
      let squery = { email: body.email };
      let userData: any = await UserV1.getUserInfo(squery, {});
      if (!userData) {
        ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      } else {
        if (!userData.password) {
          const hashedPassword = await encryptData(body.password);
          await userData.update(
            {
              password: hashedPassword,
              force: true
            });
          return ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.DIFFERENT_LOGIN_SOURCE)
        }
        let check = await decryptData(body.password, userData.password);
        if (!check) {
          ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_PASSWORD);
        } else {
          if (userData.status === COMMON_STATUS.INACTIVE) {
            return (ctx.body = sendErrorResponse(
              ctx,
              STATUS_MSG.ERROR.USER_ACCOUNT_BLOCKED
            ));
          }
          /** Create User Session */
          const sessionPayload = {
            userId: userData._id,
            isActive: true,
            lastLogin: Date.now(),
            deviceId: headers.deviceid,
            deviceToken: headers.devicetoken,
            platform: headers.platform,
          };
          let sessionResponse = await UserV1.createUserSession(sessionPayload);
          await redisDAO
            .createUserSession(sessionResponse._id, sessionPayload)
            .catch((err) => {
              console.log(err as Error);
            });
          await userData.update({ force: true });
          let jwtPayload = {
            sessionId: sessionResponse._id,
            userId: userData._id,
            timestamp: Date.now(),
          };
          /** Generate Auth Token */
          let jwtToken = await getJwtToken(jwtPayload);
          const data = { ...userData._doc, jwtToken };
          ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGGED_IN, data);
        }
      }
      return userData;
    } catch (error) {
      console.log("Error in User controller api - LoginUser Function ", error);
      return error;
    }
  }

  async registerUser(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      const headers: any = ctx.request.header;
      const squery = { email: body.email };
      const userData = await UserV1.getUserInfo(squery, {});
      if (userData && userData.status != COMMON_STATUS.DELETED) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST
        ));
      } else {
        const userData = await UserV1.createUser(body);
        const [otp, emailOtpExpiryDateTime] = await Promise.all([
          generateOtp(),
          getOtpExpiryTime(),
        ]);
        await UserV1.updateUserInfo(
          { _id: userData._id },
          {
            emailOtp: otp,
            emailOtpExpiryDateTime,
            emailVerified: false,
          }
        );
        // send otp to email
        const title = NOTIFICATION_MESSAGE.TITLE.EMAIL_VERIFICATION;
        const message = NOTIFICATION_MESSAGE.MESSAGE.EMAIL_OTP_VERIFICATION;
        await UserV1.sendOtpMail(body.email, otp, title, message);
        const notificationPayload = {
          title: NOTIFICATION_MESSAGE.TITLE.WELCOME,
          message: NOTIFICATION_MESSAGE.MESSAGE.WELCOME,
          platform: headers?.platform,
          type: NOTIFICATION_TYPE.WELCOME,
          userId: userData._id,
          appData: userData._id,
        };
        await Promise.all([
          UserV1.createUserNotification(notificationPayload),
          pushNotification.devicePayloadFormat(notificationPayload),
          smsNotify.sendSMSForTest(userData.mobile.numberWithCountryCode, notificationPayload.message)
        ]);
        return (ctx.body = utils.sendSuccess(
          STATUS_MSG.SUCCESS.OTP_SENT_MAIL,
          {}
        ));
      }
    } catch (error) {
      console.log(
        "Error in User controller api - registerUser Function ",
        error
      );
      return error;
    }
  }

  async forgetPassword(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      if (body.mobileNo) {
        const [userDetails, otp, mobileOtpExpiryDateTime] = await Promise.all([
          UserV1.getUserInfo({
            _id: userId,
          }),
          generateOtp(),
          getOtpExpiryTime(),
        ]);
        console.log("opt: ", otp, "sent on mobile: ", body.mobileNo);
        console.log("userDetails----->", userDetails);
        if (userDetails.mobile.mobileNo == body.mobileNo) {
          await UserV1.updateUserInfo(
            { _id: userDetails._id },
            {
              mobileOtp: otp,
              mobileOtpExpiryDateTime,
            }
          );
          // send otp to phone
          // sms function tobe written here;
          return (ctx.body = utils.sendSuccess(
            STATUS_MSG.SUCCESS.OTP_SENT_MOBILE,
            {}
          ));
        } else
          return (ctx.body = utils.sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.PHONE_NOT_EXIST
          ));
      } else if (body.email) {
        const [userDetails, otp, emailOtpExpiryDateTime] = await Promise.all([
          UserV1.getUserInfo({
            _id: userId,
          }),
          generateOtp(),
          getOtpExpiryTime(),
        ]);
        console.log("opt: ", otp, "sent on mail: ", body.email);
        console.log("userDetails----->", userDetails);
        if (userDetails.email == body.email) {
          await UserV1.updateUserInfo(
            { _id: userDetails._id },
            {
              emailOtp: otp,
              emailOtpExpiryDateTime,
            }
          );
          // send otp to email
          const title = NOTIFICATION_MESSAGE.TITLE.FORGOT_PASSWORD;
          const message = NOTIFICATION_MESSAGE.MESSAGE.FORGOT_PASSWORD;
          await UserV1.sendOtpMail(body.email, otp, title, message);
          return (ctx.body = utils.sendSuccess(
            STATUS_MSG.SUCCESS.OTP_SENT_MAIL,
            {}
          ));
        } else
          return (ctx.body = utils.sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.PHONE_NOT_EXIST
          ));
      } else
        return (ctx.body = utils.sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.INVALID_CREDENTIALS
        ));
    } catch (error) {
      console.log(
        "Error in User controller api - forgetPassword Function ",
        error
      );
      return error;
    }
  }

  async resetPassword(ctx: Context) {
    try {
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      let body: any = ctx.request.body;
      if (body.newPassword != body.confirmNewPassword) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.PASSWORD_MISMATCH
        ));
      } else {
        const userDetails = await UserV1.getUserInfo({ _id: userId });
        if (
          userDetails.emailOtp == body.otp ||
          userDetails.mobileOtp == body.otp
        ) {
          const password = await encryptData(body.newPassword);
          await UserV1.updateUserInfo(
            { _id: userDetails._id },
            {
              password: password,
            }
          );
          return (ctx.body = utils.sendSuccess(
            STATUS_MSG.SUCCESS.PASSWORD_RESET,
            {}
          ));
        } else
          return (ctx.body = utils.sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.INCORRECT_OTP
          ));
      }
    } catch (error) {
      console.log("error........nn.", error);
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async changePassword(ctx: Context) {
    try {
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      let body: any = ctx.request.body;
      if (body.newPassword != body.confirmNewPassword) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.PASSWORD_MISMATCH
        ));
      } else {
        const userDetails = await UserV1.getUserInfo({ _id: userId });
        let check = await decryptData(body.oldPassword, userDetails.password);
        if (!check) {
          ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.INVALID_PASSWORD);
        } else {
          const newPassword = await encryptData(body.newPassword);
          await UserV1.updateUserInfo(
            { _id: userId },
            {
              password: newPassword,
            }
          );
          return (ctx.body = utils.sendSuccess(
            STATUS_MSG.SUCCESS.PASSWORD_CHANGE,
            {}
          ));
        }
      }
    } catch (error) {
      console.log("error........nn.", error);
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async mobileSendOtp(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      const [userDetails, otp, mobileOtpExpiryDateTime] = await Promise.all([
        UserV1.getUserInfo({
          _id: userId,
        }),
        generateOtp(),
        getOtpExpiryTime(),
      ]);
      console.log("opt: ", otp, "sent on mobile: ", body.mobileNo);
      console.log("userDetails----->", userDetails);
      if (userDetails.mobile.mobileNo == body.mobileNo) {
        await UserV1.updateUserInfo(
          { _id: userDetails._id },
          {
            mobileOtp: otp,
            mobileOtpExpiryDateTime,
            phoneVerified: false,
          }
        );
        // send otp to phone
        // sms function tobe written here;
        return (ctx.body = utils.sendSuccess(
          STATUS_MSG.SUCCESS.OTP_SENT_MOBILE,
          {}
        ));
      } else
        return (ctx.body = utils.sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.PHONE_NOT_EXIST
        ));
    } catch (error) {
      console.log("Error in user controller send OTP api", error);
      return error;
    }
  }

  async emailSendOtp(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      const [userDetails, otp, emailOtpExpiryDateTime] = await Promise.all([
        UserV1.getUserInfo({
          _id: userId,
        }),
        generateOtp(),
        getOtpExpiryTime(),
      ]);
      console.log("opt: ", otp, "sent on mail: ", body.email);
      console.log("userDetails----->", userDetails);
      if (userDetails.email == body.email) {
        await UserV1.updateUserInfo(
          { _id: userDetails._id },
          {
            emailOtp: otp,
            emailOtpExpiryDateTime,
            emailVerified: false,
          }
        );
        // send otp to email
        const title = NOTIFICATION_MESSAGE.TITLE.EMAIL_VERIFICATION;
        const message = NOTIFICATION_MESSAGE.MESSAGE.EMAIL_OTP_VERIFICATION;
        await UserV1.sendOtpMail(body.email, otp, title, message);
        return (ctx.body = utils.sendSuccess(
          STATUS_MSG.SUCCESS.OTP_SENT_MAIL,
          {}
        ));
      } else
        return (ctx.body = utils.sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.PHONE_NOT_EXIST
        ));
    } catch (error) {
      console.log("Error in user controller send OTP api", error);
      return error;
    }
  }

  async resendOtp(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      // const userId = ctx.state.userId;
      const userId = "669a581b86e31e7c847ac5cd";
      const [userDetails, otp, mobileOtpExpiryDateTime] = await Promise.all([
        UserV1.getUserInfo({
          _id: userId,
        }),
        generateOtp(),
        getOtpExpiryTime(),
      ]);
      console.log("opt: ", otp, "sent on mobile: ", body.mobileNo);
      if (userDetails.mobile.mobileNo == body.mobileNo) {
        if (userDetails.resendOtpCount > process.env.OTP_LIMIT) {
          return (ctx.body = sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.OTP_LIMIT_EXCEEDED
          ));
        } else {
          await UserV1.updateUserInfo(
            { _id: userDetails._id },
            {
              mobileOtp: otp,
              mobileOtpExpiryDateTime,
              resendOtpCount: userDetails.resendOtpCount + 1,
              phoneVerified: false,
            }
          );
          // send otp to phone
          // sms function tobe written here;
          return (ctx.body = utils.sendSuccess(
            STATUS_MSG.SUCCESS.OTP_RESENT,
            {}
          ));
        }
      } else
        return (ctx.body = utils.sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.PHONE_NOT_EXIST
        ));
    } catch (error) {
      console.log("Error in User controller api - resendOtp Function ", error);
      return error;
    }
  }

  async verifyOtp(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      const userId = "66b36f3ab7cae106efcf8a63";
      const currentTime = moment().toDate();
      const userData = await UserV1.getUserInfo({ _id: userId });
      if (body.email && body.otp) {
        if (
          userData.emailOtp == body.otp &&
          userData.emailOtpExpiryDateTime > currentTime
        ) {
          const userDetail = await UserV1.updateUserInfo(
            { _id: userId },
            { emailVerified: true }
          );
          return (ctx.body = sendSuccess(
            STATUS_MSG.SUCCESS.OTP_VERIFIED,
            userDetail
          ));
        } else
          return (ctx.body = sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.INCORRECT_OTP
          ));
      } else if (body.mobileNo && body.otp) {
        if (
          userData.mobileOtp == body.otp &&
          userData.mobileOtpExpiryDateTime > currentTime
        ) {
          const userDetail = await UserV1.updateUserInfo(
            { _id: userId },
            { phoneVerified: true }
          );
          return (ctx.body = sendSuccess(
            STATUS_MSG.SUCCESS.OTP_VERIFIED,
            userDetail
          ));
        } else
          return (ctx.body = sendErrorResponse(
            ctx,
            STATUS_MSG.ERROR.INCORRECT_OTP
          ));
      }
    } catch (error) {
      console.log("Error in User controller api - resendOtp Function ", error);
      return error;
    }
  }

  async setUserProfile(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      // const userId = ctx.state.userId;
      const userId = "66b4b4fca935f25ecf751494";
      if (body.mobile.mobileNo && body.mobile.countryCode) {
        // dont take mobileNo from front-end in payload if mobile is verified
        body.fullName = body.firstName + " " + body?.lastName;
        body.mobile.numberWithCountryCode = `${body.mobile.countryCode}${body.mobile.mobileNo}`;
        const userDetail = await UserV1.updateUserInfo({ _id: userId }, body);
        const title = NOTIFICATION_MESSAGE.TITLE.MOBILE_VERIFICATION;
        const message = NOTIFICATION_MESSAGE.MESSAGE.MOBILE_OTP_VERIFICATION;
        // send otp to phone
        // sms function tobe written here;
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.PROFILE_UPDATED,
          userDetail
        ));
      } else {
        body.fullName = body.firstName + " " + body?.lastName;
        const userDetail = await UserV1.updateUserInfo({ _id: userId }, body);
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.PROFILE_UPDATED,
          userDetail
        ));
      }
    } catch (error) {
      console.log(
        "Error in User controller api - setUserProfile Function ",
        error
      );
      return error;
    }
  }

  async getUserProfile(ctx: Context) {
    try {
      const params: any = ctx.params;
      const squery = { _id: params.id };
      const userData: any = await UserV1.getUserInfo(squery, {});
      if (!userData) {
        return (ctx.body = sendErrorResponse(
          ctx,
          STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND
        ));
      } else {
        return (ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, userData));
      }
    } catch (error) {
      console.log(
        "Error in User controller api - getUserProfile Function ",
        error
      );
      return error;
    }
  }

  async updateUserProfile(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      const userId = ctx.state.userId;
      if (body.mobile.mobileNo && body.mobile.countryCode) {
        // dont take mobileNo from front-end in payload if mobile is verified
        body.fullName = body.firstName + " " + body?.lastName;
        body.mobile.numberWithCountryCode = `${body.mobile.countryCode}${body.mobile.mobileNo}`;
        const userDetail = await UserV1.updateUserInfo({ _id: userId }, body);
        const title = NOTIFICATION_MESSAGE.TITLE.MOBILE_VERIFICATION;
        const message = NOTIFICATION_MESSAGE.MESSAGE.MOBILE_OTP_VERIFICATION;
        // send otp to phone
        // sms function tobe written here;
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.PROFILE_UPDATED,
          userDetail
        ));
      } else {
        body.fullName = body.firstName + " " + body?.lastName;
        const userDetail = await UserV1.updateUserInfo({ _id: userId }, body);
        return (ctx.body = sendSuccess(
          STATUS_MSG.SUCCESS.PROFILE_UPDATED,
          userDetail
        ));
      }
    } catch (error) {
      console.log(
        "Error in User controller api - updateUserProfile Function ",
        error
      );
      return error;
    }
  }

  async logoutUser(ctx: Context) {
    try {
      const userId = ctx.state.userId;
      const userSession = await UserV1.updateUserSession(
        { userId: userId, isActive: true },
        { isActive: false }
      );
      await redisDAO.delUserSession(userSession._id);
      return (ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGOUT, {}));
    } catch (error) {
      console.log(
        "Error in User controller api - logout user Function ",
        error
      );
      return error;
    }
  }

  async getUserNotificationList(ctx: Context) {
    try {
      const userId: any = ctx.state.userId;
      const squery = { userId: userId };
      const data: any = await UserV1.getUserNotification(squery, {});
      return (ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, data));
    } catch (error) {
      console.log(
        "Error in User controller api - get-User-notification Function ",
        error
      );
      return error;
    }
  }

  async toggleNotifications(ctx: Context) {
    try {
      const body: ICommonInterface.INotification = ctx.request.body as ICommonInterface.INotification;
      const userId = ctx.state.userId;
      await UserV1.updateUserInfo(
        { _id: userId },
        {pushNotification: body.pushNotification},
      );
      ctx.body = utils.sendSuccess(STATUS_MSG.SUCCESS.NOTIFICATION_UPDATED, {});
    } catch (error) {
      return utils.sendErrorResponse(ctx, error);
    }
  }

  async socialSignup(ctx: Context) {
    const payload: UserRequest.SocialLogin = <UserRequest.SocialLogin>ctx.request.body;
    try {
      const existingUser = await UserV1.getUserInfo({ email: payload.email });
      if (existingUser) {
        return (ctx.body = sendSuccess(STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST, {}));
      }
      else {
        let socialPayload: any = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          email: payload?.email,
          displayName: payload?.displayName,
          socialType: payload?.socialType,
          profilePicture: payload?.profilePicture,
        };

        //creating a match object to dynamically assign socialId's based on social type
        let match: any = {};
        match[payload.socialType.toLowerCase() + 'Id'] = payload.socialId;

        const newUser = await UserV1.createUser(socialPayload);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.CREATED, { user: newUser });
      }
    } catch (error) {
      return Promise.reject(sendErrorResponse(ctx, { error: error.message }));
    }
  }

  async socialLogin(ctx: Context) {
    try {
      const payload: UserRequest.SocialLogin = <UserRequest.SocialLogin>ctx.request.body;
      let headers: any = ctx.request.header;

      let match: any = {};
      match[payload.socialType.toLowerCase() + 'Id'] = payload.socialId;

      let user: any = await UserV1.getUserInfo(match);
      //checking if the user has logged in from any socialid's
      if (user) {
        // ! check what to do here ? maybe update email if provided in payload
        const userData = {
          email: payload.email,
          firstName: payload.firstName
        }
        await user.update(userData);
      } else {
        user = await UserV1.getUserInfo({ email: payload.email });
        if (user) {
          user[payload.socialType.toLowerCase() + 'Id'] = payload.socialId;
          // Save the updated user data
          await user.save();
        } else {
          // TODO: user not found throw error
          return (ctx.body = sendErrorResponse(ctx, STATUS_MSG.ERROR.USER_NOT_EXIST));
        }
      }

      /** Create User Session */
      const sessionPayload = {
        userId: user._id,
        isActive: true,
        lastLogin: Date.now(),
        deviceId: headers.deviceid,
        deviceToken: headers.devicetoken,
        platform: headers.platform,
      };
      let sessionResponse = await UserV1.createUserSession(sessionPayload);
      await redisDAO
        .createUserSession(sessionResponse._id, sessionPayload)
        .catch((err) => {
          console.log(err as Error);
        });
      let jwtPayload = {
        sessionId: sessionResponse._id,
        userId: user._id,
        timestamp: Date.now()
      };
      /** Generate Auth Token */
      let jwtToken = await getJwtToken(jwtPayload);
      const data = { ...user._doc, jwtToken };
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.LOGGED_IN, data);

    } catch (error) {
      return Promise.reject(sendErrorResponse(STATUS_MSG.ERROR, { error: error.message }));
    }
  }
}

export const UserController = new User();
