import Joi from 'joi';
import Router from 'koa-router';
import { MONGO_ID_REGEX, DBENUMS, VERSION_UPDATE_TYPE, JOI_ERROR_MESSAGES, COMMON_STATUS } from '../../constant/appConstants';
import { VersionController } from '../../controllers/v1/version.controller';
import { basicAuth } from '../../middlewares/basicAuth';
import { adminAuth } from '../../middlewares/adminAuth';
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '../../utils';

export default (router: Router) => {
  /**
   * @swagger
   * /v1/admin/version/add:
   *   post:
   *     tags:
   *       - Version
   *       - V1
   *       - Module Admin

   *     description: To create version
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
   *         description: version name
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 name:
   *                     type: string
   *                     required: true
   *                 updateType:
   *                     type: string
   *                     required: true
   *                 platform:
   *                     type: string
   *                     required: true
   *                 version:
   *                     type: string
   *                     required: true
   *                 description:
   *                     type: string
   *                     required: false
   *                 isCurrentVersion:
   *                     type: boolean
   *                     required: true
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
    '/add',
    validateRequestBody(
      Joi.object({
        name: Joi.string().lowercase().min(2).max(40).required().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'any.required': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        updateType: Joi.string().valid(VERSION_UPDATE_TYPE.SOFT, VERSION_UPDATE_TYPE.FORCEFUL).required(),
        platform: Joi.string().valid(DBENUMS.DEVICE_TYPE.ANDROID, DBENUMS.DEVICE_TYPE.iOS).required(),
        version: Joi.string().required(),
        description: Joi.string().optional(),
        isCurrentVersion: Joi.boolean().required()
      })
    ),
    basicAuth,
    // adminAuth,
    VersionController.addVersion
  );

  /**
   * @swagger
   * /v1/admin/version/list:
   *   get:
   *     tags:
   *       - Version-1 Admin Version
   *       - V1
   *       - Module Admin

   *     description: Get version list
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
    VersionController.getVersions
  );

  /**
   * @swagger
   * /v1/admin/version/{id}:
   *   put:
   *     tags:
   *       - Version-1 Admin Version
   *       - V1
   *       - Module Admin

   *     description: Update version
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
   *       - name: data
   *         in: body
   *         description: version Details
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
   *                 isCurrentVersion:
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
        name: Joi.string().lowercase().min(2).max(40).optional().messages({
          'string.empty': JOI_ERROR_MESSAGES.NAME_REQUIRED,
          'string.min': JOI_ERROR_MESSAGES.NAME_MIN_LIMIT,
          'string.max': JOI_ERROR_MESSAGES.NAME_MAX_LIMIT
        }),
        description: Joi.string().optional(),
        isCurrentVersion: Joi.boolean().optional()
      })
    ),
    basicAuth,
    // adminAuth,
    VersionController.updateVersion
  );

  /**
   * @swagger
   * /v1/admin/version/status/{id}:
   *   put:
   *     tags:
   *       - Version-1 Admin Version
   *       - V1
   *       - Module Admin

   *     description: Update version Version
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
   *       - name: data
   *         in: body
   *         description: version Status
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
    VersionController.updateVersionStatus
  );

  /**
   * @swagger
   * /v1/admin/version/{id}:
   *   get:
   *     tags:
   *       - Version-1 Admin Version
   *       - V1
   *       - Module Admin

   *     description: Get version detail By ID
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
    VersionController.getVersionById
  );
};
