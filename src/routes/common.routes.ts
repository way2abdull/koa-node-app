import Router from 'koa-router';
import { CommonController } from '../controllers/v1/common.controller';
import * as utils from '../utils';
import { basicAuth } from '../middlewares/basicAuth';
const multer = require('koa-multer');
const upload = multer({ dest: 'uploads/' });
import { S3upload } from '../utils/aws.s3.utils';
import { STATUS_MSG, MONGO_ID_REGEX, JOI_ERROR_MESSAGES, COMMON_STATUS } from '../constant/appConstants';
import { validateRequestBody, validateRequestParams } from '../utils/utils';
import { MODULE } from '../constant/models.constant';
import Joi from 'joi';

export default (router: Router) => {
  /**
   * @swagger
   * /v1/common/file-upload:
   *   post:
   *     tags:
   *       - Admin
   *     description: File upload
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: basic
   *         in: header
   *         description: Basic token
   *         required: true
   *         type: string
   *       - name: file
   *         in: formData
   *         type: file
   *         description: file
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
    '/file-upload',
    basicAuth,
    upload.single('file'), async (ctx: any) => {
    try {
      let s3Url = await S3upload.uploadFile(ctx.req.file);
      return ctx.body = utils.sendSuccess(STATUS_MSG.SUCCESS.FILE_UPLOAD, { s3Url });
    } catch (error) {
      console.log('error in file upload', error);
      return utils.sendErrorResponse(ctx, error);
    }
  })

  /**
   * @swagger
   * /v1/common/admin/status/{id}:
   *   patch:
   *     tags:
   *       - User
   *     description: Update Status (ACTIVATE/DEACTIAVTE)
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
    '/admin/status/:id',
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
        module: Joi.string().required().valid(...Object.values(MODULE)),
        status: Joi.string().required().valid(...Object.values(COMMON_STATUS)),
      })
    ),
    CommonController.upadteStatus
  );

  /**
   * @swagger
   * /v1/common/user/status/{id}:
   *   patch:
   *     tags:
   *       - User
   *     description: Update Status (ACTIVATE/DEACTIAVTE)
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
    '/user/status/:id',
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
        module: Joi.string().required(),
        status: Joi.string().required().valid(...Object.values(COMMON_STATUS)),
      })
    ),
    CommonController.upadteUserStatus
  );

    // router
    // .post(
    //   "/callback",
    //   async (ctx) => {
    //     try {
    //       console.log(ctx.request.header, " ----->ss----->header");
    //       let response = await CommonController.getCreds(ctx);
    //       ctx.body = response;
    //       // ctx.response.redirect(response);
    //       return utils.sendSuccess({}, response);
    //     } catch (error) {
    //       console.log("error........nn.", error);
    //       return utils.sendErrorResponse(ctx, error);
    //     }
    //   }
    // );
}