import Router from 'koa-router';
import { StripeController } from '../../controllers/v1/stripe.controller';
import path from 'path';
import send from 'koa-send';
import { Context } from 'koa';

export default (router: Router) => {
  router
    // load html when initiating payment
    .get('/pay', async (ctx: Context) => {
      try {
        const filePath = path.resolve('../../../../src/views/payments/initiate.html');
        await send(ctx, filePath);
      } catch (err) {
        console.log(err);
        ctx.status = 404;
        ctx.body = 'File not found';
      }
    })
    .get('/error', (ctx) => {
      ctx.throw(500, 'Other Error');
    })
    .get('/success', async (ctx) => {
      const filePath = path.resolve('../../../../src/views/payments/success.html');
      try {
        await send(ctx, filePath);
      } catch (err) {
        console.log(err);
        ctx.status = 404;
        ctx.body = 'File not found';
      }
    })

    /**
      * @swagger
      * /v1/stripe/checkoutViaLink:
      *   post:
      *     tags:
      *       - Stripe
      *     description: To get checkout via stripe link
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: body
      *         in: body
      *         description: Sale Product data
      *         required: true
      *         schema:
      *           type: object
      *           properties:
      *             productName:
      *               type: string
      *               required: true
      *             amount:
      *               type: string
      *               required: true
      *             currency:
      *               type: string
      *               required: true
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .post(
      "/checkoutViaLink",
      StripeController.checkoutViaLink
    )

    /**
      * @swagger
      * /v1/stripe/createStripeAccount:
      *   post:
      *     tags:
      *       - Stripe
      *     description: create the user’s Stripe account
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: body
      *         in: body
      *         description: User's account data
      *         required: true
      *         schema:
      *           type: object
      *           properties:
      *             userId:
      *               type: string
      *               required: true
      *             email:
      *               type: string
      *               required: true
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .post('/createStripeAccount',
      StripeController.createUserStripeAccount
    )

    /**
      * @swagger
      * /v1/stripe/getStripeAccount/{userId}:
      *   get:
      *     tags:
      *       - Stripe
      *     description: To retrieve a user’s account
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: userId
      *         in: path
      *         description: User's ID
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .get('/getStripeAccount/:userId',
      StripeController.getUserStripeAccount
    )

    /**
      * @swagger
      * /v1/stripe/deleteStripeAccount/{userId}:
      *   delete:
      *     tags:
      *       - Stripe
      *     description: To delete a user’s account from stripe
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: userId
      *         in: path
      *         description: User's ID
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .delete('/deleteStripeAccount/:userId',
      StripeController.deleteUserStripeAccount
    )

    /**
      * @swagger
      * /v1/stripe/createStripeAccountLink:
      *   post:
      *     tags:
      *       - Stripe
      *     description: To creates the User’s stripe account in our system
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: body
      *         in: body
      *         description: User's account data
      *         required: true
      *         schema:
      *           type: object
      *           properties:
      *             account:
      *               type: string
      *               description: accountId
      *               required: true
      *             refresh_url:
      *               type: string
      *               required: true
      *             return_url:
      *               type: string
      *               required: true
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .post(
      "/createStripeAccountLink",
      StripeController.createUserStripeAccountLink
    )

    /**
     * @swagger
     * /v1/stripe/createSetupIntent:
     *   post:
     *     tags:
     *       - Stripe
     *     description: To creates the user’s setup intent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: setup intent data
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *             customerId:
     *               type: string
     *               description: customerId
     *               required: true
     *             amount:
     *               type: string
     *               required: true
     *             currency:
     *               type: string
     *               required: true
     *     responses:
     *       200:
     *         description: Successfully created
     *       400:
     *         description: Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    .post(
      "/createSetupIntent",
      StripeController.createUserSetupIntent
    )

    /**
      * @swagger
      * /v1/stripe/createPaymentIntent:
      *   post:
      *     tags:
      *       - Stripe
      *     description: To creates the User’s stripe account in our system
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: body
      *         in: body
      *         description: setup intent data
      *         required: true
      *         schema:
      *           type: object
      *           properties:
      *             userId:
      *               type: string
      *               required: true
      *             amount:
      *               type: string
      *               required: true
      *             currency:
      *               type: string
      *               required: true
      *     responses:
      *       200:
      *         description: Successfully created
      *       400:
      *         description: Bad Request
      *       401:
      *         description: Unauthorized
      *       404:
      *         description: Not found
      *       500:
      *         description: Internal server error
      */
    .post(
      "/createPaymentIntent",
      StripeController.createUserPaymentIntent
    )

    /**
     * @swagger
     * /v1/stripe/getAllStripeAccount:
     *   get:
     *     tags:
     *       - Stripe
     *     description: To get all the User’s stripe account in our system
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Successfully created
     *       400:
     *         description: Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    .get(
      '/getAllStripeAccount',
      StripeController.getAllCustomer
    )

    .post(
      "/catchStripeWebhook",
      StripeController.catchStripeWebhook
    )

}