import { Context } from 'koa';
import { STATUS_MSG } from '../constant';
import * as utils from '../utils';

/**
 * 
 * @param ctx : Context object containing request & response objects
 * @param next : next function in the pipeline
 * @returns ctx with admin user data
 */
export const userAuth = async (ctx: Context, next) => {
    try {
        let settings = {
            tokenType: "Bearer"
        }
        if (!ctx.header || !ctx.header.authorization) {
            return utils.sendErrorResponse(ctx, STATUS_MSG.ERROR.HEADER_MISSING)
        }
        let authorization = ctx.header.authorization;
        let authArray = authorization.split(' ');
        const tokenType = authArray[0];
        const token = authArray[1];
        if (!token || tokenType !== settings.tokenType) {
            return utils.sendErrorResponse(ctx, STATUS_MSG.ERROR.MISSINING_AUTHENTICATION(settings.tokenType));
        }
        let decryptedUserData = await utils.verifyJwtToken(token);
        console.log("token.......", decryptedUserData);
      
        await next();
                
    } catch (error) {
        console.log("error in user auth....", error)
        return Promise.reject(error)
    }
}

export const apiKeyFunction = (api_key) => {
    return (api_key === "1234") ? true : false
}
