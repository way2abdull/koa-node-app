import { Middleware, Context } from 'koa'
import { STATUS_MSG } from '../constant'
import { sendMessageOnError } from '../utils';

export default (opts?): Middleware => {
  return async (ctx: Context, next) => {
    try {
      await next();
    } catch (err) {
      console.log("...................error from meddileware...................", err,err.name);
      sendMessageOnError(ctx.request.url, err);
      let errReturn = await errorHandler(ctx.request.url, err);
      ctx.status = errReturn.statusCode;
      ctx.body = errReturn.payload;
    }
  }
}

let errorHandler = async (url, err) => {
  switch (err.name || (JSON.parse((err.message.replace("", " ")).split(/[./-]/)[1]).code)) {
    case "BadRequestError": {
      sendMessageOnError(url, err);
      return {
        statusCode: err.status,
        payload: {
          statusCode: err.status,
          message: err.message,
          data: {}
        }
      }
    }
    case "JsonWebTokenError": {
      sendMessageOnError(url, err);
      return {
        statusCode: 401,
        payload: {
          statusCode: 401,
          message: STATUS_MSG.ERROR.INVALID_TOKEN.message,
          data: {}
        }
      }
    }
    case "ValidationError": {
      sendMessageOnError(url, err);
      return {
        statusCode: 400,
        payload: {
          statusCode: 400,
          message: err.message,
          data: {}
        }
      }
    }
    case "TokenExpiredError": {
      sendMessageOnError(url, err);
      return {
        statusCode: 401,
        payload: {
          statusCode: 401,
          message: STATUS_MSG.ERROR.INVALID_LINK,
          data: {}
        }
      }
    }
    case "SyntaxError": {
      sendMessageOnError(url, err);
      return {
        statusCode: 400,
        payload: {
          statusCode: 400,
          message: STATUS_MSG.ERROR.BAD_REQUEST.message,
          data: {}
        }
      }
    }
    case "bad_request": {
      sendMessageOnError(url, err);
      return {
        statusCode: 400,
        payload: {
          statusCode: 400,
          message: STATUS_MSG.ERROR.BAD_REQUEST.message,
          data: { data: 'hello' }
        }
      }
    }
    default: {
      sendMessageOnError(url, err);
      return {
        statusCode: err.statusCode ? err.statusCode : STATUS_MSG.ERROR.BAD_REQUEST.statusCode,
        payload: {
          statusCode: err.statusCode ? err.statusCode : STATUS_MSG.ERROR.BAD_REQUEST.statusCode,
          message: err.message ? err.message : STATUS_MSG.ERROR.BAD_REQUEST.statusCode,
          data: {}
        }
      }
    }
  }
}
