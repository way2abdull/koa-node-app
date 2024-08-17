import Router from 'koa-router';
import { UserController } from '../../controllers/v1/user.controller';
// import * as utils from '../../utils';
import Joi from 'joi';
import { validateRequestBody, validateRequestHeaders, validateRequestParams, validateRequestQuery } from '../../utils/utils';
import { EMAIL_REGEX, COUNTRY_CODE_REGEX, MONGO_ID_REGEX, NAME_REGEX, JOI_ERROR_MESSAGES, DBENUMS } from '../../constant/appConstants';
import { basicAuth } from '../../middlewares/basicAuth';
import { userAuth } from '../../middlewares/userAuth';

export default (router: Router) => {
  router

  /**
   * @swagger
   * /v1/user/login:
   *   post:
   *     tags:
   *       - User
   *       - V1
   *     description: Login User
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
    validateRequestHeaders(
      Joi.object({
        deviceid: Joi.string().required(),
        devicetoken: Joi.string().optional().allow(''),
        platform: Joi.number().valid(0, 1, 2).required()
      })
    ),
    validateRequestBody(
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        hashKey: Joi.string().optional().allow(""),
      })
    ),
    UserController.LoginUser
  )

  /**
   * @swagger
   * /v1/user/register:
   *   post:
   *     tags:
   *       - User
   *       - V1
   *     description: Register User
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
   *         description: user signup/register
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 email:
   *                     type: string
   *                     required: true
   *                 phoneNumber:
   *                     type: string
   *                     required: true
   *     responses:
   *       200:
   *         description: Successfully registered
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
    '/register',
    basicAuth,
    validateRequestBody(
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
        mobile: Joi.object({
          countryCode: Joi.string().required(),
          mobileNo: Joi.string().required(),
        }).optional(),
      })
    ),
    UserController.registerUser
  )

  /**
   * @swagger
   * /v1/user/mobile/sendOtp:
   *   put:
   *     tags:
   *       - Version-1 Users
   *       - Module Users
   *       - V1
   *     description: To send otp to user phone
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
   *       - name: data
   *         in: body
   *         description: user phone update
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 mobileNo:
   *                     type: string
   *                     required: false
   *                 countryCode:
   *                     type: string
   *                     required: false
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
  router.put(
    '/mobile/sendOtp',
    basicAuth,
    validateRequestBody(
      Joi.object({
        mobileNo: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),
        countryCode: Joi.string().min(2).max(7).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
        })
      })
    ),
    UserController.mobileSendOtp
  )

  /**
   * @swagger
   * /v1/user/email/sendOtp:
   *   post:
   *     tags:
   *       - Version-1 Users
   *       - Module Users
   *       - V1
   *     description: To send otp to user e-mail
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
   *       - name: data
   *         in: body
   *         description: user phone update
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 mobileNo:
   *                     type: string
   *                     required: false
   *                 countryCode:
   *                     type: string
   *                     required: false
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
  router.post(
    '/email/sendOtp',
    basicAuth,
    validateRequestBody(
      Joi.object({
        email: Joi.string().email().required().messages({
          'string.empty': JOI_ERROR_MESSAGES.EMAIL_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.EMAIL_REQUIRED
        })
      })
    ),
    UserController.emailSendOtp
  )

  /**
   * @swagger
   * /v1/user/resendOtp:
   *   put:
   *     tags:
   *       - Version-1 Users
   *       - Module Users
   *       - V1
   *     description: To re-send otp to user phone
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
   *       - name: data
   *         in: body
   *         description: user phone update
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 mobileNo:
   *                     type: string
   *                     required: false
   *                 countryCode:
   *                     type: string
   *                     required: false
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
  router.put(
    '/resendOtp',
    basicAuth,
    validateRequestBody(
      Joi.object({
        mobileNo: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),
        countryCode: Joi.string().min(2).max(7).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
        })
      })
    ),
    UserController.resendOtp
  )

  /**
   * @swagger
   * /v1/user/verifyOtp:
   *   put:
   *     tags:
   *       - Version-1 Users
   *       - Module Users
   *       - V1
   *     description: To verify user otp
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
   *       - name: data
   *         in: body
   *         description: user phone update
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 mobileNo:
   *                     type: string
   *                     required: false
   *                 countryCode:
   *                     type: string
   *                     required: false
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
  router.put(
    '/verifyOtp',
    basicAuth,
    validateRequestBody(
      Joi.object({
        email: Joi.string().regex(EMAIL_REGEX).min(5).max(50).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.EMAIL_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.EMAIL_REQUIRED,
          'string.pattern.base': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.min': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT,
          'string.max': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT
        }),
        mobileNo: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),
        countryCode: Joi.string().regex(COUNTRY_CODE_REGEX).min(2).max(7).optional().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
        }),
        otp: Joi.string().max(4).min(4).required().messages({
          'string.empty': JOI_ERROR_MESSAGES.OTP_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.OTP_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.OTP_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.OTP_MAX_LIMIT,
          'string.pattern.base': JOI_ERROR_MESSAGES.OTP_INVALID_FORMAT,
          'string.regex': JOI_ERROR_MESSAGES.OTP_INVALID_FORMAT
        })
      })
    ),
    UserController.verifyOtp
  )

  /**
   * @swagger
   * /v1/user/set-profile
   *   put:
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
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.put(
    '/set-profile',
    userAuth,
    validateRequestBody(
      Joi.object({
        mobile: Joi.object({
          countryCode: Joi.string().regex(COUNTRY_CODE_REGEX).min(2).max(7).required().messages({
            'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
            'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
          }),
          mobileNo: Joi.string().min(7).max(15).required().messages({
            'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
            'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
            'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
            'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
          }),
        }).optional(),
        firstName: Joi.string().min(2).max(25).required().regex(NAME_REGEX).messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.regex': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.pattern.base': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        lastName: Joi.string().min(2).max(25).required().allow('').regex(NAME_REGEX).messages({
          'string.regex': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.pattern.base': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        imageUrl: Joi.string().optional(),
      })
    ),
    UserController.setUserProfile
  )

  /**
   * @swagger
   * /v1/user/{id}:
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
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.get(
    '/:id',
    basicAuth,
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    UserController.getUserProfile
  )

  /**
   * @swagger
   * /v1/user/edit-profile
   *   put:
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
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.put(
    '/edit-profile',
    basicAuth,
    validateRequestBody(
      Joi.object({
        mobile: Joi.object({
          countryCode: Joi.string().regex(COUNTRY_CODE_REGEX).min(2).max(7).required().messages({
            'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
            'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
          }),
          mobileNo: Joi.string().min(7).max(15).required().messages({
            'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
            'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
            'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
            'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
          }),
        }).optional(),
        firstName: Joi.string().min(2).max(25).required().regex(NAME_REGEX).messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.regex': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.pattern.base': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        lastName: Joi.string().min(2).max(25).required().allow('').regex(NAME_REGEX).messages({
          'string.regex': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.pattern.base': JOI_ERROR_MESSAGES.NAME_INVALID,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        imageUrl: Joi.string().optional(),
      })
    ),
    UserController.updateUserProfile
  )

  /**
   * @swagger
   * /v1/user/forgot-password:
   *   post:
   *     tags:
   *       - User
   *     description: user forgot password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: query
   *         description: admin login
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
    '/forgot-password',
    validateRequestBody(
      Joi.object({
        email: Joi.string().regex(EMAIL_REGEX).min(10).max(50).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.pattern.base': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.min': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT,
          'string.max': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT
        }),
        mobileNo: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),
        countryCode: Joi.string().regex(COUNTRY_CODE_REGEX).min(2).max(7).optional().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.COUNTRY_CODE_INVALID
        })
      })
    ),
    basicAuth,
    UserController.forgetPassword
  )

  /**
   * @swagger
   * /v1/user/reset-password:
   *   put:
   *     tags:
   *       - User
   *     description: user forgot password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.put(
    '/reset-password',
    validateRequestBody(
      Joi.object({
        otp: Joi.string().max(4).min(4).required().messages({
          'string.empty': JOI_ERROR_MESSAGES.OTP_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.OTP_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.OTP_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.OTP_MAX_LIMIT,
          'string.pattern.base': JOI_ERROR_MESSAGES.OTP_INVALID_FORMAT,
          'string.regex': JOI_ERROR_MESSAGES.OTP_INVALID_FORMAT
        }),
        newPassword: Joi.string().required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION,
          'string.regex': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION
        }),
        confirmNewPassword: Joi.string().required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION,
          'string.regex': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION
        }),
      })
    ),
    basicAuth,
    UserController.resetPassword
  )

  /**
   * @swagger
   * /v1/user/change-password:
   *   put:
   *     tags:
   *       - User
   *     description: user change password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.put(
    '/change-password',
    validateRequestBody(
      Joi.object({
        oldPassword: Joi.string().required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION,
          'string.regex': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION
        }),
        newPassword: Joi.string().required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION,
          'string.regex': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION
        }),
        confirmNewPassword: Joi.string().required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION,
          'string.regex': JOI_ERROR_MESSAGES.PASSWORD_VALIDATION
        }),
      })
    ),
    basicAuth,
    UserController.changePassword
  )

  /**
   * @swagger
   * /v1/user/logout:
   *   post:
   *     tags:
   *       - User
   *     description: Logout User
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
    '/logout',
    basicAuth,
    UserController.logoutUser
  )

  /**
   * @swagger
   * /v1/user/list-notification:
   *   get:
   *     tags:
   *       - User
   *     description: Get User in app notification list
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: data
   *         in: query
   *         description: admin login
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
  router.get(
    '/list-notification',
    basicAuth,
    UserController.getUserNotificationList
  )
   
  /**
   * @swagger
   * /v1/user/settings/toggle-notifications:
   *   put:
   *     tags:
   *       - Users
   *     description: To enable/disable notifications
   *     produces:
   *       - application/json
   *     security:
   *       - BasicAuth: []
   *       - UserBearerAuth: []
   *     parameters:
   *       - name: data
   *         in: body
   *         description: enable/disable notifications
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 pushNotification:
   *                     type: boolean
   *                     required: optional
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
  router.put(
    '/settings/toggle-notifications',
    validateRequestBody(
      Joi.object({
        pushNotification: Joi.boolean().required(),
      })
    ),
    basicAuth,
    userAuth,
    UserController.toggleNotifications
  )

  router.post('/social-signup',
    validateRequestBody(
      Joi.object({
        email: Joi.string().required(),
        socialId: Joi.string().required(),
        socialType: Joi.string().valid(...Object.values(DBENUMS.SOCIAL_TYPE)).required(),
        profilePicture: Joi.string().uri().optional(),
      }).unknown(true)
    ),
    UserController.socialSignup,
  )

  router.post('/social-login',
    validateRequestHeaders(
      Joi.object({
        deviceid: Joi.string().required(),
        devicetoken: Joi.string().optional().allow(''),
        platform: Joi.number().valid(0, 1, 2).required()
      })
    ),
    validateRequestBody(
      Joi.object({
        email: Joi.string().required(),
        socialId: Joi.string().required().optional(),
        socialType: Joi.string().valid(...Object.values(DBENUMS.SOCIAL_TYPE)),
      })
    ),
    UserController.socialLogin
  )
}