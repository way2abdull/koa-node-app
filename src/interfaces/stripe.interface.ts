declare namespace StripeRequest {
    export interface CheckoutRequest {
        receiverId:string;
        userId :string;
        amount?: number;
        currency?: string;
        productName?: string
    }

    export interface CreateCustomer {
        email?: String;
        firstName?: String;
        lastName?: String;
        phone?: number,
    }

    export interface CreateAccount {
        email?: any;
        customerId: string;
        userId: string;
    }

    export interface CreateAccountLink {
        accountId?: string
        refresh_url?: string
        return_url?: string
    }
}
