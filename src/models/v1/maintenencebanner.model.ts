import { Document, Schema, model } from 'mongoose';
import { COMMON_STATUS, DBENUMS } from '../../constant/appConstants';

export interface IMaintenencebannerModel extends Document {
  name: string;
  description?: string;
  platform: string;
  status: string;
}

export const MaintenencebannersSchema: any = new Schema(
  {
    name: { type: String, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, required: false },
    platform: { type: String, required: false, enum: Object.values(DBENUMS.DEVICE_TYPE), default:DBENUMS.DEVICE_TYPE.ALL },
    status: {
      type: String,
      enum: Object.values(COMMON_STATUS),
      default: COMMON_STATUS.ACTIVE,
      intex:true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export const Maintenencebanner = model<IMaintenencebannerModel>('Maintenencebanner', MaintenencebannersSchema);

