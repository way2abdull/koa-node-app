import { Document, Schema, Types, model } from 'mongoose';
import { NOTIFICATION_TYPE, COMMON_STATUS } from '../../constant/appConstants';

export interface INotificationModel extends Document {
  title: string;
	message: string;
	platform: string;
	type: string;
	image: string;
	userId: string;
	appData: string;
	isRead: boolean;
	isViewed: boolean;
	isActionBlocked: boolean;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

export const NotificationSchema: any = new Schema(
  {
    title: { type: String, required: true, index: true },
    message: { type: String, required: true },
    platform: { type: String, required: false },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPE) },
    image: { type: String, required: false, default: "" },
    userId: { type: Types.ObjectId, ref:'User', required: false, index: true },
    appData: { type: String, required: false },
    isRead: { type: Boolean, required: false, default: false },
    isViewed: { type: Boolean, required: false, default: false },
    isActionBlocked: { type: Boolean, required: false, default: false },
    status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.ACTIVE },
  },
  {
    versionKey: false,
    timestamps: true
  }
);
export const UserNotification = model<INotificationModel>('Usernotification', NotificationSchema);