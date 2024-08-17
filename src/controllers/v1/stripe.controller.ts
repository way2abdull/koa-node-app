import { Context } from "koa";
import Stripe from 'stripe';
import { CONFIG, ENUM, STATUS_MSG, STRIPE } from "../../constant";
import { DAOManager } from '../../db/daoManager';
import { consoleData, sendErrorResponse, sendSuccess } from "../../utils";
import { User } from "../../models";
import { StripeAccount } from "../../models/v1/stripe.model";
import { Types } from 'mongoose';
import { StripeWebhookLog } from "../../models/v1/stripewebhook.model";
const dbManager = new DAOManager();

const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

class StripeClass {
  /**
   * @description method to creates a payment link on stripe
   * @param amount
   * @param currency
   * @param productName 
   * @returns 
   */
  async checkoutViaLink(ctx: Context) {
    let paymentLink: Stripe.PaymentLink;
    let payload = ctx.request.body as StripeRequest.CheckoutRequest;
    try {
      //creating the product
      const product = await stripe.products.create({ name: payload.productName });
      // Create a price for the product
      const price = await stripe.prices.create({
        unit_amount: payload.amount * 100,
        currency: payload.currency || STRIPE.CURRENCY_TYPE.INR,
        product: product.id,
      });
      // Create a payment link with the price and customer details
      paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${CONFIG.APP.BASE_URL}:${CONFIG.APP.PORT}/v1/stripe/success`,
          },
        },
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: [
            <Stripe.PaymentLinkCreateParams.ShippingAddressCollection.AllowedCountry>STRIPE.ACCOUNT.COUNTRY.IN,
            <Stripe.PaymentLinkCreateParams.ShippingAddressCollection.AllowedCountry>STRIPE.ACCOUNT.COUNTRY.US,
          ]
        },
        invoice_creation: { enabled: true },
      });
      //save the payment logs
      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.PAYMENT_LINK, ctx.originalUrl, payload, paymentLink, STRIPE.PAYMENT_STATUS.SUCCESS);
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, { url: paymentLink.url });
    }
    catch (error) {
      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.PAYMENT_LINK, ctx.originalUrl, payload, paymentLink, STRIPE.PAYMENT_STATUS.SUCCESS);
      consoleData("Error in stripe controller api", error)
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }
  /**
   * @description method to creates a stripe account for the user
   * @param userId,
   * @param email
   * @returns 
   */
  async createUserStripeAccount(ctx: Context) {
    try {
      consoleData("inside createAccount()");
      let payload: StripeRequest.CreateAccount = <StripeRequest.CreateAccount>ctx.request.body;
      let [user, userStripeAccount] = await Promise.all([
        User.findById({ _id: Types.ObjectId(payload.userId) }),
        StripeAccount.findById({ _id: Types.ObjectId(payload.userId) })
      ])

      if (!user) {
        return Promise.reject(STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      };

      if (!userStripeAccount) {
        let [stripeCustomer, stripeAccount] = await Promise.all([
          await StripeController.createCustomer(user),
          await StripeController.createAccount(user)
        ])

        if (stripeCustomer && stripeAccount) {
          userStripeAccount = await StripeAccount.create({
            userId: payload.userId,
            stripeCustomerId: stripeCustomer.id,
            stripeAccountId: stripeAccount.id
          })
        }
      }
      return ctx.body = sendSuccess(STATUS_MSG.SUCCESS.CREATED, { userStripeAccount: userStripeAccount, });
    } catch (error) {
      console.error(`We have an error in StripePaymentService: createAccount() => ${error}`);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  async createCustomer(user) {
    try {
      console.log("inside createCustomer()");

      const params: Stripe.CustomerCreateParams = {
        email: user.email,
        name: user.firstName,
        metadata: {
          userId: user.userId
        },
      };

      const customer: Stripe.Customer = await stripe.customers.create(params);
      console.log("Created stripe customer: ", customer);
      return customer;
    } catch (error) {
      console.error(`We have an error in StripePaymentService: createCustomer() => ${error}`);
    }
  }

  /**
   * 
   * @description method to create a user account on stripe
   * @param email 
   * @returns 
   */
  async createAccount(user) {
    try {
      consoleData("inside createAccount()");
      // get user data from DB who is initiating payment
      let userData = {
        first_name: user.firstName,
        last_name: user.last_name,
        email: user.email
      }
      const param: Stripe.AccountCreateParams = {
        email: user.email,
        country: STRIPE.ACCOUNT.DEFAULT_COUNTRY,
        type: <Stripe.AccountCreateParams.Type>STRIPE.ACCOUNT.TYPE.STANDARD,
        business_type: <Stripe.AccountCreateParams.BusinessType>STRIPE.ACCOUNT.BUSINESS_TYPE,
        individual: userData
      }
      const account: Stripe.Account = await stripe.accounts.create(param);
      consoleData("Created stripe account: ", account);
      return account;
    } catch (error) {
      console.error(`We have an error in StripePaymentService: createAccount() => ${error}`);
    }
  }

  /**
   * @description method to get user stripe account
   * @param userId,
   * @returns 
   */
  async getUserStripeAccount(ctx: Context) {
    try {
      let payload: any = ctx.params;
      let userStripeAccount = await StripeAccount.findOne({ userId: payload.userId });
      if (!userStripeAccount) {
        return ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, {
          userStripeAccount: {},
          stripeAccountStatus: false
        });
      } else {
        let stripeAccount = await stripe.accounts.retrieve(userStripeAccount.stripeAccountId);
        ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, {
          userStripeAccount: userStripeAccount,
          stripeAccountStatus: stripeAccount.details_submitted
        });
      }
    } catch (error) {
      console.log("Error: ", error, false);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
   * @description method to delete user stripe account
   * @param userId
   * @returns 
   */
  async deleteUserStripeAccount(ctx: Context) {
    try {
      let payload: any = ctx.params;
      let stripeAccount = await StripeAccount.findOne({ userId: payload.userId });

      if (!stripeAccount) {
        return Promise.reject(STATUS_MSG.ERROR.ACCOUNT_NOT_FOUND);
      }
      await Promise.all([
        await stripe.customers.del(stripeAccount.stripeCustomerId),
        await stripe.accounts.del(stripeAccount.stripeAccountId),
      ])
      await stripeAccount.deleteOne();
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DELETED, {});
    } catch (error) {
      console.log("Error: ", error, false);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
* @description method to get all customer details from stripe
* @returns 
*/
  async getAllCustomer(ctx: Context) {
    try {
      consoleData("inside getAllCustomer()");
      const customer = await stripe.customers.list();
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, { customer: customer });
    } catch (error) {
      console.error(`We have an error in StripePaymentService: getCustomer() => ${error}`);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
   * @description method to create an onboarding account link
   * @param account
   * @param refresh_url
   * @param return_url
   * @returns 
   */
  async createUserStripeAccountLink(ctx: Context) {
    try {
      let payload: StripeRequest.CreateAccountLink = <StripeRequest.CreateAccountLink>ctx.request.body;
      consoleData("inside createAccountLink()");
      const params: Stripe.AccountLinkCreateParams = {
        account: payload.accountId,
        refresh_url: payload.refresh_url,  //the url to be used to when customer click on refresh
        return_url: payload.return_url,  //the url of the app screen when click on return button
        type: <Stripe.AccountLinkCreateParams.Type>STRIPE.ACCOUNT.ONBOARDING_TYPE.ACCOUNT_ONBOARDING
      };

      const accountLink = await stripe.accountLinks.create(params);
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, { accountLink: accountLink });
    } catch (error) {
      console.error(`We have an error in StripePaymentService: createAccountLink() => ${error}`);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
   * Create setup intent for a user
   * @param customerId 
   * @returns 
   */
  async createUserSetupIntent(ctx: Context) {
    let params, setupIntent;
    try {
      consoleData("inside createSetupIntents()");
      let payload: StripeRequest.CreateAccount = <StripeRequest.CreateAccount>ctx.request.body;
      params = {
        automatic_payment_methods: {
          enabled: true
        },
        customer: payload.customerId,
      };
      setupIntent = await stripe.setupIntents.create(params);
      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.CARD, ctx.originalUrl, params, setupIntent, STRIPE.PAYMENT_STATUS.SUCCESS);
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, { clientSecret: setupIntent.client_secret });
    } catch (error) {
      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.CARD, ctx.originalUrl, params, setupIntent, STRIPE.PAYMENT_STATUS.SUCCESS);
      console.error(`We have an error in StripePaymentService: createSetupIntents() => ${error}`);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
  * Initiate payment on Stripe
  * @param customerId 
  * @param amount 
  * @returns 
  */
  async createUserPaymentIntent(ctx: Context) {
    let params: Stripe.PaymentIntentCreateParams, paymentIntent;
    try {
      consoleData("inside createPaymentIntents()");
      let payload: StripeRequest.CheckoutRequest = <StripeRequest.CheckoutRequest>ctx.request.body;
      let [user, userStripeAccount] = await Promise.all([
        User.findById({ _id: new Types.ObjectId(payload.userId) }),
        StripeAccount.findOne({ userId: payload.userId })
      ])

      let shippingAddress = {
        name: 'Abhijeet Mzp',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
      }
      if (!user) {
        return Promise.reject(STATUS_MSG.ERROR.USER_NOT_EXIST);
      };

      params = {
        automatic_payment_methods: {
          enabled: true,
        },
        customer: userStripeAccount.customerId,
        amount: payload.amount,
        currency: payload.currency || STRIPE.CURRENCY_TYPE.INR,
        description: STRIPE.ACCOUNT.DEFAULT_DESC,
        shipping: shippingAddress,
      }
      paymentIntent = await stripe.paymentIntents.create(params);

      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.CARD, ctx.originalUrl, params, paymentIntent, STRIPE.PAYMENT_STATUS.SUCCESS);
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, { clientSecret: paymentIntent.client_secret });
    } catch (error) {
      await StripeController.logPayment('user', STRIPE.PAYMENT_METHOD, STRIPE.PAYMENT_TYPE.CARD, ctx.originalUrl, params, paymentIntent, STRIPE.PAYMENT_STATUS.FAILURE);
      console.error(`We have an error in StripePaymentService: createPaymentIntents() => ${error}`);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  async catchStripeWebhook(ctx: Context) {
    try {
      const body: any = ctx.request.body;
      const eventType = body.type;
      console.log("Received stripe webhook ----->>>>>>>>>>>>");
      console.log(body.data.customer);
      
      switch (eventType) {
        case 'payment_intent.succeeded': {
          StripeWebhookLog.create({
            customerId: body.data.object.customer,
            eventType: eventType,
            field: JSON.stringify(body)
          });
          break;
        }
        default: {
          StripeWebhookLog.create({
            customerId: body.data.object.customer,
            eventType: eventType,
            field: JSON.stringify(body)
          });
          break;
        } 
      }
      ctx.body = sendSuccess(STATUS_MSG.SUCCESS.DEFAULT, {});
    } catch (error) {
      console.log('Error in catchStripeWebhook(): ', error);
      return Promise.reject(sendErrorResponse(ctx, error));
    }
  }

  /**
   * @description function to save the payment logs
   */
  async logPayment(userId: string, type: string, subType: string, URL: string, request: object, response: object, status: string) {
    const logEntry = {
      userId: userId,
      type: type,
      subType: subType,
      URL: URL,
      request: request,
      response: response,
      status: status,
      createdAt: new Date()
    };
    await dbManager.saveData("PaymentModel", logEntry);
  }
}

export const StripeController = new StripeClass()