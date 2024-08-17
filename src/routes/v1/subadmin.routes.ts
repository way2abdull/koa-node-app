import Joi from 'joi';
import Router from 'koa-router';
import { MONGO_ID_REGEX, EMAIL_REGEX, JOI_ERROR_MESSAGES, COMMON_STATUS } from '../../constant/appConstants';
import { SubAdminController } from '../../controllers/v1/subadmin.controller';
import { basicAuth } from '../../middlewares/basicAuth';
import { adminAuth } from '../../middlewares/adminAuth';
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '../../utils';

export default (router: Router) => {


   /**
   * @swagger
   * /v1/admin/create-subadmin:
   *   post:
   *     tags:
   *       - Sub Admin
   *     description: Create SubAdmin
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
   *                 confirmPassword:
   *                     type: string
   *                     required: true
   *                 firstName:
   *                     type: string
   *                     required: true
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
   router.post(
    '/create-subadmin',
    basicAuth,
    validateRequestBody(
      Joi.object({
        email: Joi.string().regex(EMAIL_REGEX).min(10).max(50).required().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.pattern.base': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.regex': JOI_ERROR_MESSAGES.EMAIL_INVALID,
          'string.min': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT,
          'string.max': JOI_ERROR_MESSAGES.EMAIL_MINMAX_FORMAT
        }),
        firstName: Joi.string().lowercase().min(2).max(40).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        lastName: Joi.string().lowercase().min(2).max(40).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        phone: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),        
        roleId:  Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        }),
        imageUrl: Joi.string().optional()
      }),
    ),
    SubAdminController.createSubAdmin
  )

  

  /**
   * @swagger
   * /v1/admin/subadmin/list:
   *   get:
   *     tags:
   *       - Sub Admin 
   *     description: Get subadmin list
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
   *         description: status ["ACTIVATED", "DEACTIVATED"]
   *         required: false
   *         type: string
   *       - name: search
   *         in: query
   *         description: search keywords(Search by Sport name)
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
    '/list',
    validateRequestQuery(
      Joi.object({
        page: Joi.number().required(),
        limit: Joi.number().min(0).max(100).default(10).required(),
        status: Joi.string().valid(COMMON_STATUS.ACTIVE, COMMON_STATUS.INACTIVE).optional(),
        search: Joi.string().optional(),
        sortBy: Joi.string().optional(),
        orderBy: Joi.number().valid(1, -1).optional()
      })
    ),
    basicAuth,
    // adminAuth,
    SubAdminController.getSubAdminList
  );

  /**
   * @swagger
   * /v1/admin/subadmin/{id}:
   *   put:
   *     tags:
   *       - Sub Admin
   *     description: Update Subadmin
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
   *       - name: id
   *         in: path
   *         description: Role id
   *         required: false
   *         type: String
   *       - name: data
   *         in: body
   *         description: roles Details
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 name:
   *                     type: string
   *                     required: true
   *                 description:
   *                     type: string
   *                     required: false
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
  router.put(
    '/:id',
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
        firstName: Joi.string().lowercase().min(2).max(40).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        lastName: Joi.string().lowercase().min(2).max(40).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        phone: Joi.string().min(7).max(15).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.MOBILE_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.MOBILE_INVALID,
          'string.max': JOI_ERROR_MESSAGES.MOBILE_INVALID
        }),
        roleId:  Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        }),
        imageUrl: Joi.string().optional()
      })
    ),
    basicAuth,
    // adminAuth,
    SubAdminController.updateSubAdminProfile
  );

  /**
   * @swagger
   * /v1/admin/subadmin/status/{id}:
   *   put:
   *     tags:
   *       - Sub Admin
   *     description: Update subadmin Status
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
   *       - name: id
   *         in: path
   *         description: Role id
   *         required: false
   *         type: String
   *       - name: data
   *         in: body
   *         description: Role Status
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 status:
   *                     type: string
   *                     required: true
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
  router.put(
    '/status/:id',
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
        status: Joi.string().valid(...Object.values(COMMON_STATUS)).optional()
      })
    ),
    basicAuth,
    // adminAuth,
    // SubAdminController.updateSubAdminStatus
  );

  /**
   * @swagger
   * /v1/admin/subadmin/{id}:
   *   get:
   *     tags:
   *       - Sub Admin
   *     description: Get Sub admin detail By ID
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
   *       - name: id
   *         in: path
   *         description: Version id
   *         required: false
   *         type: String
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
    '/:id',
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': JOI_ERROR_MESSAGES.INVALID_MONGO_ID,
          'string.regex': JOI_ERROR_MESSAGES.INVALID_MONGO_ID
        })
      })
    ),
    basicAuth,
    // adminAuth,
    SubAdminController.getSubAdminProfile
  );
};
