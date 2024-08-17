import { Middleware, Context } from 'koa'
import * as CONSTANT from '../constant/appConstants'
import { sendErrorResponse } from '../utils';

export const basicAuth = async (ctx: Context, next) => {
    try {
      const appversion = ctx.header.appversion;
    //   ctx.header.language = ctx.header.language || LANGUAGE.ENGLISH;
      console.log('appversion => ', appversion);
      let settings = {
        tokenType: 'Basic'
        // tokenType: 'Authorization'
      };
  
      if (!ctx.header?.authorization) {
        return sendErrorResponse(ctx, CONSTANT.STATUS_MSG.ERROR.MISSINING_AUTHENTICATION(settings.tokenType));
      }
  
      let basicAuthorization = ctx.header.authorization.toString();
  
      const [tokenType, token] = basicAuthorization.split(/\s+/);
  
      if (!token || tokenType !== settings.tokenType) {
        return sendErrorResponse(ctx, CONSTANT.STATUS_MSG.ERROR.MISSINING_AUTHENTICATION(settings.tokenType));
      }
  
      let checkFunction = await validateBasicAuth(token);
      if (!checkFunction) {
        return sendErrorResponse(ctx, CONSTANT.STATUS_MSG.ERROR.UNAUTHORIZED);
      }
    } catch (error) {
      return Promise.reject(error);
    }
    await next();
  };
  
  let validateBasicAuth = async function (access_token) {
    const credentials = Buffer.from(access_token, 'base64').toString('ascii');
  
    const [username, password] = credentials.split(':');
  
    if (username === process.env.B_A_NAME && password === process.env.B_A_PASSWORD) {
      return true;
    }
    return false;
  };
  
