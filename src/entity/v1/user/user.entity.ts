import * as Services from "../../../db/daoManager";
import mongoose from "mongoose";
import { User } from "../../../models/v1/user.model";
import {
  UserSession,
} from "../../../models/v1/userSession.model";
import { encryptData } from "../../../utils/utils";
import { mailManager } from "../../../utils/mail";
import { TemplateUtil } from "../../../utils/templateUtils";
import { UserNotification } from '../../../models/v1/userNotification.model';

export class UserEntity {
  public ObjectId = mongoose.Types.ObjectId;
  public DAOManager: any = new Services.DAOManager();
  protected modelName: ModelNames | any;
  constructor(modelName?) {
    this.modelName = modelName;
  }

  /**
   * @param payload - get user info
   */
  async getUserInfo(query, projection = {}) {
    let details = await User.findOne(query, projection);
    return details;
  }

  /**
   * creates a new user
   * @param payload - user data to insert
   */
  async createUser(payload: any): Promise<any> {
    if (
      payload?.password &&
      payload.confirmPassword &&
      payload.password == payload.confirmPassword
    ) {
      payload.password = await encryptData(payload.password);
    }
    if(payload.mobile?.mobileNo && payload.mobile?.countryCode){
      payload.mobile.numberWithCountryCode = `${payload.mobile.countryCode}${payload.mobile.mobileNo}`
    }
    let userData = await new this.modelName(payload).save();
    userData = userData.toObject();
    delete userData.password;
    delete userData.updatedAt;
    return userData;
  }

  async createUserSession(payload: any): Promise<any> {
    let userSessionData = await UserSession.create(payload);
    return userSessionData;
  }

  async updateUserSession(filter: any, update: any) {
    let userSessionData = await UserSession.findOneAndUpdate(filter, update);
    return userSessionData;
  }

  async updateUserInfo(filter, update) {
    let details = await User.findOneAndUpdate(filter, update, { new: true, lean: true })
    return details;
  }

  async sendOtpMail(email, otp, title, message) {
    if (email) {
      const mailContent = await new TemplateUtil(
        `${process.cwd()}/src/utils/template/sendOtpUser.html`)
      .compileFile({
        title: title,
				description: `${message}<br><br>
						OTP: ${otp}<br>
						E-mail: ${email}`,
      });
      mailManager.sendMail({
        to: email,
        subject: title,
        html: mailContent,
      });
    }
  }

  async createUserNotification(payload) {
    const details = await UserNotification.create(payload)
    return details;
  }

  async getUserNotification(query, projection = {}) {
    const details = await UserNotification.find(query, projection);
    return details;
  }

}

export const UserV1 = new UserEntity(User);
