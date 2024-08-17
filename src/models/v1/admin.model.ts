import { Schema, model, Document, Types } from "mongoose";
import { DBENUMS, COMMON_STATUS } from "../../constant";

export interface IAdminModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    emailVerified: Boolean;
    phoneVerified: Boolean;
    type:string;
    role:string;
    roleId: Types.ObjectId;
    restPasswordToken:string;
    restPasswordTokenExpiryAt:{type: Date};
    isProfileCompleted:boolean;
    imageUrl: string;

}

export const AdminSchema: any = new Schema({
    firstName:{ type: String, trim: true, required :true },
    lastName:{ type: String, trim: true, },
    email: { type: String, lowercase: true, trim: true, index: true, unique: false },    
    password: { type: String, trim: true, },  
    phone: { type: String, trim: true, },  
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    type: { type: Number, trim: true, default: 0 },  
    roles: { type: String, trim: true, default:"subadmin" },  
    roleId: { type: Types.ObjectId, ref: 'Role', required: true , index: true},
    restPasswordToken:{ type: String, trim: true,default: '' },  
    restPasswordTokenExpiryAt:{ type: Date, trim: true, default: ''},  
    status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.ACTIVE },
    isProfileCompleted: { type: Boolean, default :false },
    imageUrl: { type: String, trim: true,  default: '' },

}, {
    timestamps: true,
    versionKey: false
});

export const Admin = model<IAdminModel>('Admin', AdminSchema);