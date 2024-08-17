import { Document, Schema, model } from 'mongoose';
import { COMMON_STATUS, DBENUMS, VERSION_UPDATE_TYPE } from '../../constant/appConstants';

export interface IVersionModel extends Document {
  name: string;
  updateType: string;
  platform: string;
  version: string;
  description?: string;
  isCurrentVersion: boolean;
  status: string;
}

export const VersionsSchema: any = new Schema(
  {
    name: { type: String, trim: true, lowercase: true, unique: true, index: true },
    updateType: { type: String, enum: Object.values(VERSION_UPDATE_TYPE) },
    platform: { type: String, required: false, enum: Object.values(DBENUMS.DEVICE_TYPE) },
    version: { type: String, trim: true, required: true },
    description: { type: String, required: false },
    isCurrentVersion: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(COMMON_STATUS),
      default: COMMON_STATUS.ACTIVE
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
VersionsSchema.index({ name: 'text' });
export const Version = model<IVersionModel>('Version', VersionsSchema);
