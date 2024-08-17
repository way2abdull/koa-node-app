import { Document, Schema, SchemaTypes, Types, model } from 'mongoose';

export interface IUserSessionModel extends Document {
  userId: Types.ObjectId;
  isActive: boolean;
  deviceId: string;
  deviceToken: string;
  language: string;
  platform: string;
  lastLogin: Date;
}

export const UserSessionSchema: any = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true , index: true},
    isActive: { type: SchemaTypes.Boolean, default: true, index: true },
    deviceId: {
      type: String,
      required: true
    },
    lastLogin: {
      type: Date,
      required: false
    },
    deviceToken: {
      type: String,
      required: true,
      index: true
    },
    language: {
      type: String,
      required: false,
      index: true
    },
    platform: {
      type: String,
      required: true,
      index:true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const UserSession = model<IUserSessionModel>('UserSession', UserSessionSchema);