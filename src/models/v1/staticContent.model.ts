import { Document, Schema, model } from "mongoose";
import { STATIC_MANAGEMENT_TYPE, LANGUAGE, COMMON_STATUS } from "../../constant/appConstants";

export interface IStaticManagementModel extends Document {
  _id: string;
  contentType: string;
  content: string;
  language: string;
  status: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  faq: [object];
}

export const faqDetails: any = new Schema({
  question: { type: String },
  answer: { type: String },
});

export const staticManagementSchema = new Schema(
  {
    content: { type: String, default: "" },
    faq: {
        type: [faqDetails],
        default: [],
    },
    contentType: {
        type: String,
        trim: true,
        index: true,
        enum: Object.values(STATIC_MANAGEMENT_TYPE),
    },
    language: {
        type: String,
        enum: Object.values(LANGUAGE),
        default: LANGUAGE.English
    },
    image: { type: String, required: false },
    status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.ACTIVE },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const StaticContent = model<IStaticManagementModel>(
  "StaticContent",
  staticManagementSchema
);
