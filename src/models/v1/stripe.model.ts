import { Document, Schema, Model, model } from 'mongoose';

export interface IStripeAccount extends Document {
    customerId: string;
    userId: string;
    stripeCustomerId: string;
    stripeAccountId: string;
    payoutAmount: number;
}

const StripeAccountSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
            ref: 'User'
        },
        stripeCustomerId: {
            type: String,
            required: true
        },
        stripeAccountId: {
            type: String,
            required: true
        },
        payoutAmount: {
            type: Number,
            default: 0.0
        },
    },
    {                                                    
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const StripeAccount: Model<IStripeAccount> = model<IStripeAccount>('StripeAccount', StripeAccountSchema);
export const ParentModelName = 'StripeAccount';
