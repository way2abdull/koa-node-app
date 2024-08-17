import Joi from 'joi';
import Router from 'koa-router';
import { MONGO_ID_REGEX, STATIC_MANAGEMENT_TYPE, JOI_ERROR_MESSAGES, DBENUMS } from '../../constant/appConstants';
import { ContentController } from '../../controllers/v1/content.controller';
import { basicAuth } from '../../middlewares/basicAuth';
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '../../utils';

export default (router: Router) => {
  /**
   * @swagger
   * /v1/admin/content/add:
   *   post:
   *     tags:
   *       - Version-1 Admin Content
   *       - V1
   *       - Module Admin
   *     description: To create content
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
   *         description: content name
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 contentType:
   *                     type: string
   *                     required: true
   *                     example: "CONTACT_US"
   *                     description: "'PRIVACY_POLICY', 'TERMS_AND_CONDITIONS', 'FAQ', 'ABOUT_US'"
   *                 image:
   *                     type: string
   *                     required: false
   *                     example: "pic.img"
   *                 content:
   *                     type: string
   *                     required: false
   *                     example: "privacy policy"
   *                 language:
   *                     type: string
   *                     required: false
   *                     example: "How Secure is my information?"
   *                 faqDetails:
   *                     type: array
   *                     required: false
   *                     example: "question and answer"
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
        contentType: Joi.string().valid(...Object.values(STATIC_MANAGEMENT_TYPE)).required(),
        content: Joi.string().trim().optional(),
        language: Joi.string().optional(),
        image: Joi.string().optional(),
        faq: Joi.array().optional(),
      })
    ),
    basicAuth,
    // adminAuth,
    ContentController.addContent
  );

  /**
   * @swagger
   * /v1/admin/content/list:
   *   get:
   *     tags:
   *       - Version-1 Admin Content
   *       - V1
   *       - Module Admin
   *     description: get content list
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
   *       - name: contentType
   *         in: query
   *         description: "'PRIVACY_POLICY', 'TERMS_AND_CONDITIONS', 'FAQ', 'ABOUT_US'"
   *         required: false
   *         type: string
   *       - name: status
   *         in: query
   *         description: "'ACTIVE', 'INACTIVE'"
   *         required: false
   *         type: string
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
        status: Joi.string().valid(...Object.values(DBENUMS.STATUS)).optional(),
        contentType: Joi.string().valid(...Object.values(STATIC_MANAGEMENT_TYPE)).optional(),
      })
    ),
    basicAuth,
    // adminAuth,
    ContentController.getContent
  );

  /**
   * @swagger
   * /v1/admin/content/{id}:
   *   get:
   *     tags:
   *       - Version-1 Admin Content
   *       - V1
   *       - Module Admin
   *     description: Get Content
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
   *         description: content id
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
          'string.pattern.base': 'Please Enter Valid mongo id',
          'string.regex': 'Please Enter Valid mongo id'
        })
      })
    ),
    basicAuth,
    // adminAuth,
    ContentController.getContentById
  );

  /**
   * @swagger
   * /v1/admin/content/{id}:
   *   put:
   *     tags:
   *       - Version-1 Admin Content
   *       - V1
   *       - Module Admin
   *     description: Update content
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
   *         description: Sport Details
   *         required: true
   *         schema:
   *              type: object
   *              properties:
   *                 id:
   *                     type: string
   *                     required: true
   *                     example: "345678iu5678"
   *                 contentType:
   *                     type: string
   *                     required: false
   *                     example: "CONTACT_US"
   *                     description: " 'PRIVACY_POLICY', 'TERMS_AND_CONDITIONS', 'FAQ', 'ABOUT_US'"
   *                 image:
   *                     type: string
   *                     required: false
   *                     example: "pic.img"
   *                 content:
   *                     type: string
   *                     required: false
   *                     example: "privacy policy"
   *                 faq:
   *                     type: array
   *                     example: [{question: "How Secure is my information?", answer: "Highly"}]
   *                 status:
   *                     type: string
   *                     required: false
   *                     example: "ACTIVE"
   *                     description: "'ACTIVE', 'INACTIVE'"
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
        content: Joi.string().trim().optional(),
        image: Joi.string().optional(),
        faq: Joi.array().items(Joi.string().trim().optional()).optional(),
      })
    ),
    basicAuth,
    // adminAuth,
    ContentController.updateContent
  );

  /**
   * @swagger
   * /v1/admin/content/{id}:
   *   delete:
   *     tags:
   *       - Version-1 Admin Content
   *       - V1
   *       - Module Admin
   *     description: Remove Content
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
   *         description: content id
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
  router.delete(
    '/:id',
    validateRequestParams(
      Joi.object({
        id: Joi.string().regex(MONGO_ID_REGEX).required().messages({
          'string.pattern.base': 'Please Enter Valid mongo id',
          'string.regex': 'Please Enter Valid mongo id'
        })
      })
    ),
    basicAuth,
    // adminAuth,
    ContentController.removeContent
  );
};
