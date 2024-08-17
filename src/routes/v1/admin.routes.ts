import Router from 'koa-router';
import { AdminController } from '../../controllers/v1/admin.controller';
import { AdminNotificationController } from '../../controllers/v1/adminNotification.controller';
import Joi from 'joi';
import { validateRequestBody, validateRequestHeaders, validateRequestParams, validateRequestQuery } from '../../utils/utils';
import { MONGO_ID_REGEX, JOI_ERROR_MESSAGES, DBENUMS, STATUS_MSG } from '../../constant/appConstants';
import { basicAuth } from '../../middlewares/basicAuth';
import { adminAuth } from '../../middlewares/adminAuth';
import { S3upload } from '../../utils/aws.s3.utils'
const multer = require('koa-multer');
const upload = multer({ dest: 'uploads/' });
import {
  sendErrorResponse,
  sendSuccess,
} from "../../utils";

export default (router: Router) => {
    router

    /**
   * @swagger
   * /v1/admin/login:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: Login Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: user login
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 email:
   *                     type: string
   *                     required: true
   *                 password:
   *                     type: string
   *                     required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
    router.post(
      '/login',
      basicAuth,
      adminAuth,
      validateRequestBody(
        Joi.object({
          email: Joi.string().required(),
          password:Joi.string().required(),
          // hashKey: Joi.string().optional().allow(""),
        })
      ),
      AdminController.LoginAdmin
    )

    /**
     * @swagger
     * /v1/admin/admin-user-details:
     *   get:
     *     tags:
     *       - Admin
     *       - V1
     *     description: To get config details
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Authorization
     *         in: header
     *         description: Basic token
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
    router.get(
      "/admin-user-details",
      basicAuth,
      validateRequestQuery(
        Joi.object({
          adminId: Joi.string().required(),
        })
      ),
      AdminController.getAdminProfile
    )

     /**
   * @swagger
   * /v1/admin/update-admin:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: Update Sub Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: user login
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 adminId:
   *                     type: string
   *                     required: true
   *                 firstName:
   *                     type: string
   *                     required: false
   *                 lastName:
   *                     type: string
   *                     required: false
   *                 phone:
   *                     type: string
   *                     required: false
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
     router.patch(
      '/update-admin',
      basicAuth,
      validateRequestBody(
        Joi.object({
          adminId:Joi.string().required(),
          firstName:Joi.string().required(),
          lastName:Joi.string().optional(),
          phone:Joi.string().optional(),
          hashKey: Joi.string().optional().allow(""),
        })
      ),
      AdminController.updateAdminProfile
    )


     /**
   * @swagger
   * /v1/admin/forgot-password:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: Forgot-password Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: user login
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 email:
   *                     type: string
   *                     required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
     router.post(
      '/forgot-password',
      basicAuth,
      validateRequestBody(
        Joi.object({
          email: Joi.string().required(),
        })
      ),
      AdminController.forgetAdminPassword
    )

     /**
   * @swagger
   * /v1/admin/verify-resetpass-token:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: verify-resetpass-token Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: admin Reset password token verification
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 token:
   *                     type: string
   *                     required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
     router.post(
      '/verify-resetpass-token',
      basicAuth,
      validateRequestBody(
        Joi.object({
          token: Joi.string().required(),
        })
      ),
      AdminController.verifyAdminResetPasswordToken
    )


    /**
   * @swagger
   * /v1/admin/reset-password:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: Reset password Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: user login
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 adminId:
   *                     type: string
   *                     required: true
   *                 password:
   *                     type: string
   *                     required: true
   *                 confirmPassword:
   *                     type: string
   *                     required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
    router.patch(
      '/reset-password',
      basicAuth,
      validateRequestBody(
        Joi.object({
          adminId: Joi.string().required(),
          password: Joi.string().required(),
          confirmPassword: Joi.string().required()
        })
      ),
      AdminController.resetAdminPassword
    )


      /**
   * @swagger
   * /v1/admin/logout-admin:
   *   post:
   *     tags:
   *       - Admin
   *       - V1
   *     description: - logout Admin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
      router.post(
        '/logout-admin',
        basicAuth,
        adminAuth,
        AdminController.logoutAdmin
      )

  // ADMIN USER MANAGEMENT APIS

  /**
   * @swagger
   * /v1/admin/user/list:
   *   get:
   *     tags:
   *       - Admin
   *       - V1
   *       - Module Admin
   *     description: Get users list
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: basic
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: Authorization
   *         in: header
   *         description: Bearer token
   *         required: true
   *         type: string
   *       - name: page
   *         in: query
   *         description: page number
   *         required: true
   *         type: number
   *       - name: limit
   *         in: query
   *         description: page limit
   *         required: true
   *         type: number
   *       - name: status
   *         in: query
   *         description: status ["ACTIVE", "DEACTIVATED"]
   *         required: false
   *         type: string
   *       - name: search
   *         in: query
   *         description: search keywords(Search by users name)
   *         required: false
   *         type: string
   *       - name: sortBy
   *         in: query
   *         description: Field name for sorting
   *         required: false
   *         type: string
   *       - name: orderBy
   *         in: query
   *         description: "ASC: 1 / DESC: -1"
   *         required: false
   *         type: number
   *     responses:
   *       200:
   *         description: Successful
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/user/list',
    validateRequestQuery(
      Joi.object({
        page: Joi.number().required(),
        limit: Joi.number().min(0).max(100).default(10).required(),
        status: Joi.number().optional().valid(...Object.values(DBENUMS.ACCOUNT_STATUS)),
        search: Joi.string().optional(),
        sortBy: Joi.string().optional(),
        orderBy: Joi.number().valid(1, -1).optional()
      })
    ),
    basicAuth,
    // adminAuth,
    AdminController.getUsersList
  ) 

  /**
   * @swagger
   * /v1/admin/user/{id}:
   *   get:
   *     tags:
   *       - User
   *     description: Get User Details
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/user/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    AdminController.getUserDetail
  );

  /**
   * @swagger
   * /v1/admin/notification/add:
   *   post:
   *     tags:
   *       - User
   *     description: Send/create Admin notification
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/notification/add',
    basicAuth,
    validateRequestBody(
      Joi.object({
        title: Joi.string().required(),
        platform: Joi.string().optional(),
        smsDescription: Joi.string().optional(),
        pushDescription: Joi.string().optional(),
        emailDescription: Joi.string().optional(),
        userType: Joi.string().required(),
        users: Joi.array().optional(),
        notificationType: Joi.string().required(),
        image: Joi.string().optional(),
        deliveryStatus: Joi.string().optional(),
      })
    ),
    AdminNotificationController.createAdminNotification
  );

  /**
   * @swagger
   * /v1/admin/notification/send/{id}:
   *   post:
   *     tags:
   *       - User
   *     description: Send Admin notification
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/notification/send/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    AdminNotificationController.sendAdminNotification
  );

  /**
   * @swagger
   * /v1/admin/notification/list:
   *   get:
   *     tags:
   *       - User
   *     description: Get Admin notification List
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/notification/list',
    basicAuth,
    validateRequestQuery(
      Joi.object({
        page: Joi.number().required(),
        limit: Joi.number().min(0).max(100).default(10).required(),
        status: Joi.number().optional().valid(...Object.values(DBENUMS.ACCOUNT_STATUS)),
        search: Joi.string().optional(),
        sortBy: Joi.string().optional(),
        orderBy: Joi.number().valid(1, -1).optional()
      })
    ),
    AdminNotificationController.getNotificationList
  );

  /**
   * @swagger
   * /v1/admin/notification/{id}:
   *   get:
   *     tags:
   *       - User
   *     description: Get Admin notification details
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/notification/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    AdminNotificationController.getNotificationDetails
  );

  /**
   * @swagger
   * /v1/admin/notification/{id}:
   *   put:
   *     tags:
   *       - User
   *     description: Update Admin notification details
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.put(
    '/notification/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    validateRequestBody(
      Joi.object({
        title: Joi.string().required(),
        platform: Joi.string().optional(),
        smsDescription: Joi.string().optional(),
        pushDescription: Joi.string().optional(),
        emailDescription: Joi.string().optional(),
        userType: Joi.string().required(),
        users: Joi.array().optional(),
        notificationType: Joi.string().required(),
        image: Joi.string().optional(),
      })
    ),
    AdminNotificationController.updateNotificationDetails
  );

  /**
   * @swagger
   * /v1/admin/notification/{id}:
   *   patch:
   *     tags:
   *       - User
   *     description: Update Admin notification status
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: id
   *         in: query
   *         description: user id
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  router.patch(
    '/notification/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    validateRequestBody(
      Joi.object({
        status: Joi.string().required(),
      })
    ),
    AdminNotificationController.upadteNotificationStatus
  )

}