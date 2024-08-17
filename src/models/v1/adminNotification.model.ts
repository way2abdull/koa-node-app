import { Document, Schema, Types, model } from "mongoose";
import { COMMON_STATUS, DBENUMS } from "../../constant/appConstants";

export interface IAdminNotificationModel extends Document {
  title: string;
  platform: string;
  smsDescription: string;
  emailDescription: string;
  pushDescription: string;
  image: string;
  userType: string;
  users: [];
  notificationType: [];
  deliveryStatus: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminNotificationSchema: any = new Schema(
  {
    title: { type: String, trim: true, required: true, default: "", index: true},
    platform: { type: String, required: false, enum: [...Object.values(DBENUMS.DEVICE_TYPE)]},
    smsDescription: { type: String, required: false, trim: true, default: ""},
    pushDescription: { type: String, required: false, trim: true, default: ""},
    emailDescription: { type: String, required: false, trim: true, default: ""},
    userType: { type: String, required: true, enum: Object.values(DBENUMS.USER_TYPE), default: DBENUMS.USER_TYPE.ALL},
    users: [{ type: Types.ObjectId, ref: "User", required: false, index: true}],
    notificationType: [{ type: String, required: true, enum: Object.values(DBENUMS.ADMIN_NOTIFICATION_TYPE)}],
    image: { type: String, required: false, default: ""},
    status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.ACTIVE},
    deliveryStatus: { type: String, enum: Object.values(DBENUMS.NOTIFICATION_STATUS), default: DBENUMS.NOTIFICATION_STATUS.DRAFT}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const AdminNotification = model<IAdminNotificationModel>(
  "AdminNotification",
  AdminNotificationSchema
);
