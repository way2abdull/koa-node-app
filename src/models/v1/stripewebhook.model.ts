import { Schema, model, Document } from 'mongoose';

interface IStripeWebhookLog extends Document {
    customerId?: string;
    accountId: string;
    eventType: string;
    field: string;
}

const StripeWebhookLogSchema = new Schema<IStripeWebhookLog>(
    {
        customerId: {
            type: String,
            required: false
        },
        accountId: {
            type: String,
            required: false
        },
        eventType: {
            type: String,
            required: true
        },
        field: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const StripeWebhookLog = model<IStripeWebhookLog>('StripeWebhookLog', StripeWebhookLogSchema);
export const ParentModelName = 'StripeWebhookLog';