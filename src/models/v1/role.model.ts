import { Document, Schema, model } from 'mongoose';
import { COMMON_STATUS } from '../../constant/appConstants';

export interface IRoleModel extends Document {
  name: string;
  description?: string;
  allowedmoduels: any;
  status: string;
}

export const RolesSchema: any = new Schema(
  {
    name: { type: String, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, required: false },
    allowedmoduels: { type: Array, default: [] },
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
export const Roles = model<IRoleModel>('Role', RolesSchema);

