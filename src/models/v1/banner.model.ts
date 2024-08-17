import { Document, Schema, model } from 'mongoose';
import { COMMON_STATUS, DBENUMS, REDIRECTION_TYPE, BANNER_PAGES } from '../../constant/appConstants';

export interface IBannerModel extends Document {
  name: string;
  description?: string;
  order: string;
  image: string;
  redirection: string;
  redirectionUrl: string;
	page: [];
  status: string;
}

export const BannersSchema: any = new Schema(
  {
    name: { type: String, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, required: false },
    order: { type: String, required: true, default: 1},
    image: { type: String, required: true, default: ''},
    redirection: { type: String, required: true, enum: Object.values(REDIRECTION_TYPE), default:REDIRECTION_TYPE.NO},
    redirectionUrl: { type: String, required: false},
    page: { type: [String], required: false, enum: Object.values(BANNER_PAGES), default: BANNER_PAGES.HOME_PAGE },
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
export const Banner = model<IBannerModel>('Banner', BannersSchema);

