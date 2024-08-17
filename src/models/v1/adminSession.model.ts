import { Document, Schema, SchemaTypes, Types, model } from 'mongoose';

export interface IAdminSessionModel extends Document {
  adminId: Types.ObjectId;
  isActive: boolean;
  deviceId: string;
  deviceToken: string;
  platform: string;
  lastLogin: Date;
}

export const AdminSessionSchema: any = new Schema(
  {
    adminId: { type: Types.ObjectId, ref: 'Admin', required: true, index: true },
    isActive: { type: SchemaTypes.Boolean, default: true },
    deviceId: {
      type: String,
      required: false
    },
    lastLogin: {
      type: Date,
      required: true
    },
    deviceToken: {
      type: String,
      required: false
    },
    platform: {
      type: String,
      required: false
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const AdminSession = model<IAdminSessionModel>('AdminSession', AdminSessionSchema);