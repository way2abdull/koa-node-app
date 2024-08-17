import { Schema, model, Document, Types } from "mongoose";
import { DBENUMS, COMMON_STATUS } from "../../constant";

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  emailVerified: Boolean;
  phoneVerified: Boolean;
  emailOtp: string;
  mobileOtp: string;
  emailOtpExpiryDateTime: Date;
  mobileOtpExpiryDateTime: Date;
  resendOtpCount: string;
  resendOtpTimeOut: { type: Date };
  isProfileCompleted: Boolean;
  mobile: {
    countryCode: string;
    mobileNo: string;
    numberWithCountryCode: string;
  };
  imageUrl: string;
  status: string;
  socialId: string;
  googleId: string;
  facebookId: string;
  linkedinId: string;
  twitterId: string;
  displayName: string;
  socialType: string;
  profilePicture: string;
  pushNotification: Boolean;
}

export const UserSchema: any = new Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    fullName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: false,
    },
    password: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    emailOtp: { type: String, default: "" },
    mobileOtp: { type: String, default: "" },
    emailOtpExpiryDateTime: { type: Date },
    mobileOtpExpiryDateTime: { type: Date },
    resendOtpCount: { type: Number, default: 0 },
    resendOtpTimeOut: { type: Date },
    isProfileCompleted: { type: Boolean, default: false },
    mobile: {
      countryCode: { type: String, default: "" },
      mobileNo: { type: String, default: "" },
      numberWithCountryCode: { type: String, default: "" },
    },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(COMMON_STATUS),
      default: COMMON_STATUS.ACTIVE,
    },
    googleId: { type: String, required: false },
    facebookId: { type: String, required: false },
    linkedinId: { type: String, required: false },
    twitterId: { type: String, required: false },
    appleId: { type: String, required: false },
    socialType: { type: String, enum: DBENUMS.SOCIAL_TYPE, required: false },
    profilePicture: { type: String, required: false },
    force: { type: Boolean, default: false },
    pushNotification: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUserModel>("User", UserSchema);
