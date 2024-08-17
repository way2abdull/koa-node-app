import { Schema, model, Document } from "mongoose";
import { STRIPE, COMMON_STATUS } from "../../constant";
export interface IPaymentModel extends Document {
    userId: String,
    type: String,
    subType: String,
    URL: String,
    request: Object,
    response: Object,
    status: String
}

export const PaymentModelSchema: any = new Schema({
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: STRIPE.PAYMENT_METHOD, required: true },
    subType: { type: String, enum: STRIPE.PAYMENT_TYPE, required: true, index: true },
    URL: { type: String, required: true },
    request: { type: Object, required: true },
    response: { type: Object, required: false },
    status: { type: String, required: true, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.ACTIVE }
}, {
    timestamps: true,
    versionKey: false
});

export const PaymentModel = model<IPaymentModel>('StripePaymentLog', PaymentModelSchema);