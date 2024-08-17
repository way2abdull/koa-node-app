'use strict'
import Joi from 'joi'
import { STATUS_MSG, SALT, ENVIRONMENT } from '../constant/appConstants'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { CONFIG } from "../constant";
import nodemailer from "nodemailer";

/** to
 * @description method for console.log
 * @param data any console.log(data)
 */
export async function consoleData(...data: any) {
    process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION ?
        data.map((elem) => { console.log(elem); }) : console.log(data);
}

export const getJwtToken = async (body: any, time?: number) => {
    //console.log(body, '------------body');
    const option: any = {};
    if (time) {
        option['expiresIn'] = time;
    }
    return await jwt.sign(body, CONFIG.JWT_SECRET_KEY, option)
}

export const verifyJwtToken = async (token: string, secret?) => {
    let secretKey = secret ? secret : CONFIG.JWT_SECRET_KEY;
    return await jwt.verify(token, secretKey)
}

export let generateOtp = async function () {
  let min = Math.ceil(1000);
  let max = Math.floor(9999);
  return process.env.OTP_BYPASS == 'true' ? process.env.BYPASS_OTP : (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

export const getOtpExpiryTime = () => {
  return new Date(new Date().setHours(new Date().getHours() + Number(process.env.OTP_EXPIRY_TIME)));
};


/*
* @name failActionFunction
* @returns object
* @description generate 4 digit random integer for otp.
*/
export let failActionFunction = async function (request, h, err) {
    console.log("err", err);
    let customErrorMessage = "";
    if (err.name === "ValidationError") {
        customErrorMessage = err.details[0].message;
    } else {
        customErrorMessage = err.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, "");
    customErrorMessage = customErrorMessage.replace("[", "");
    customErrorMessage = customErrorMessage.replace("]", "");
    return customErrorMessage;
};

/**
 * @description send message on flock channel
 * @param error 
 */
export async function sendMessageOnError(url, error) {
    try {
        // let flockUrl;
        // process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION ? flockUrl = FLOCKURL.DEVELOPMENT : flockUrl = FLOCKURL.PRODUCTION;
        // const stringifiedError = JSON.stringify(`we have an error in server ==> ${url}-----${error}`);
        // let taskData = await fetch(flockUrl, {
        //     method: 'Post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept-Language': 'en_US'
        //     },
        //     body: JSON.stringify({ 'text': stringifiedError })
        // });
    } catch (error) {
        console.error(error);
    }
}


export const sendErrorResponse = (ctx, error) => {
    console.log("error.........", error);
    switch (error.name) {
        case "MongoError": {
            if (error.code == 11000) {
                ctx.status = 400;
                consoleData(error.errmsg, ctx.request, "--------error");
                return ctx.body = {
                    statusCode: 400,
                    success: error.success ? error.success : false,
                    message: "This" + error.errmsg.split(':')[2].split('_')[0] + " is already registered.",
                    data: {}
                }
            } else {
                ctx.status = 500;
                consoleData(error.errmsg)
                return ctx.body = {
                    statusCode: 500,
                    success: false,
                    message: STATUS_MSG.ERROR.IMP_ERROR.message,
                    data: {}
                }
            }
        }
        case "ValidationError": {
            ctx.status = 400;
            return ctx.body = {
                statusCode: 400,
                success: false,
                message: error.message,
                data: {}
            }
        }
        default: {
            switch (error.type) {
                case "DB_ERROR":
                case "IMP_ERROR": {
                    ctx.status = error.statusCode ? error.statusCode : 500;
                    return ctx.body = {
                        statusCode: error.statusCode ? error.statusCode : 500,
                        success: false,
                        message: error.message,
                        data: {}
                    }
                }
                default: {
                    ctx.status = 200; //error.statusCode ? error.statusCode : 500;
                    consoleData(error.errmsg)
                    return ctx.body = {
                        statusCode: error.statusCode ? error.statusCode : 500,
                        success: error.success,
                        message: error.message,
                        data: {}
                    }
                }
            }
        }
    }
}


export let sendSuccess = function (successMsg, data, status?) {
    if (data === null) {
        return { statusCode: 400, success: false, message: STATUS_MSG.ERROR.BAD_REQUEST.message, data: {} }
    }
    if (typeof data === 'object' && data.hasOwnProperty('password')) {
        delete data['password']
    }

    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('message')) {
        return { statusCode: data.statusCode, success: true, message: data.message, type: data.type, data: data.data || {} }

    } else if (successMsg != null && typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('message')) {
        successMsg = successMsg || STATUS_MSG.SUCCESS.DEFAULT.message
        return { statusCode: successMsg.statusCode, success: true, message: successMsg.message, data: data || {} }

    } else {
        successMsg = successMsg || STATUS_MSG.SUCCESS.DEFAULT.message
        return { statusCode: status ? status : 200, success: true, message: successMsg, data: data || {} }
    }
}


export const decryptData = async function (stringToCheck: string, dbString: string) {
    console.log(stringToCheck, dbString, 'compare')
    try {
        let hash = await bcrypt.compare(stringToCheck, dbString)
        return hash
    } catch (error) {
        return Promise.reject(error);
    }

}

export function sleep(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

export const sendAdminMail = async (receiverMail: string, subject: string, content: any) => {
    try {
    
        // if (process.env.NODE_ENV != ENVIRONMENT.PRODUCTION) { 
        var transporter = nodemailer.createTransport({
            host: CONFIG.SYS_MAIL_CREDS.SYS_HOST,
            port: CONFIG.SYS_MAIL_CREDS.SYS_PORT,
            secure: true,
            requireTLS: true,
            auth: {
                user: CONFIG.SYS_MAIL_CREDS.SYS_USER,
                pass: CONFIG.SYS_MAIL_CREDS.SYS_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        // console.log("transporter:   ", transporter)

        var mailOptions = {
            from: `Test App <${CONFIG.SYS_MAIL_CREDS.SYS_EMAIL}>`,
            to: receiverMail,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOptions, function (err: Error, data: any) {
            if (err) {
                console.log("err: ", err)
            }
            console.log("data:", data);
        });
        // } else { //
        //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@SES@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //     sendEmailViaSes(smtpCredentials.senderEmailId, receiverMail, subject, content);
        // }
    } catch (error) {
        console.log(error, 'ccccc')
    };
    return {}
}


export const decodeToken = async (token: string) => {
    let payload, type;
    try {
        payload = jwt.verify(token, CONFIG.JWT_SECRET_KEY);
        if (payload) {
            return { success: true, data: payload };
        } else return { success: false, message: "invalid" };
    } catch (err) {
        type = err.name == "TokenExpiredError" ? "expired" : "invalid";
        return { success: false, message: type }
    }
}

export const getBucket = (id: string) => {
    consoleData(id, "user id in bucket");
    let bucket = id.replace(/\D/g, "")               //regex to replace alphabets from stringified object id
    return bucket.substr(0, 3)
}

export const getDate = () => {
    let currDate = new Date();

    return currDate;
}

export let authorizationHeaderObj = Joi.object({
    api_key: Joi.string().required().description('api key is required'),
    offset: Joi.string().optional().description('offset is required')
  }).unknown();
  
  export let cronAuthHeaderObj = Joi.object({
    api_key: Joi.string().required().description('api key is required')
  }).unknown();
  
  export const encryptData = async (password: string) => {
    return await bcrypt.hash(password, SALT);
  };

// Custom middleware to validate request body using Joi
export const validateRequestBody = (schema) => {
    return async (ctx, next) => {
      console.log('=>>>>>>>>>  ctx.request.body =>>> ', ctx.request.body);
      try {
        const validatedData = await schema.validateAsync(ctx.request.body, {
          abortEarly: false
        });
        ctx.validatedData = validatedData;
        await next();
      } catch (error) {
        let messages: Array<string> = error.details.map((err) => {
          return err.message.split("'").join('').replace(new RegExp('"', 'gi'), '');
        });
        const message: string = messages[0];
  
        ctx.status = 400;
        ctx.body = {
          statusCode: 400,
          success: false,
          message,
          data: {}
        };
      }
    };
  };

  export const validateRequestHeaders = (schema) => {
    return async (ctx, next) => {
      try {
        const validatedData = await schema.validateAsync(
          {
            deviceid: ctx.request.header?.deviceid,
            devicetoken: ctx.request.header?.devicetoken,
            platform: ctx.request.header?.platform
          },
          {
            abortEarly: false
          }
        );
        ctx.validatedData = validatedData;
        await next();
      } catch (error) {
        let message: string = error.details.map((err) => {
          return err.message.split("'").join('').replace(new RegExp('"', 'gi'), '');
        });
        ctx.status = 400;
        ctx.body = {
          statusCode: 400,
          success: false,
          message,
          data: {}
        };
      }
    };
  };
  
  // Custom middleware to validate request query using Joi
  export const validateRequestQuery = (schema) => {
    return async (ctx, next) => {
      console.log('=>>>>>>>>>  ctx.request.query =>>> ', ctx.request.query);
      try {
        const validatedData = await schema.validateAsync(ctx.request.query, {
          abortEarly: false
        });
        ctx.validatedData = validatedData;
        await next();
      } catch (error) {
        let messages: Array<string> = error.details.map((err) => {
          return err.message.split("'").join('').replace(new RegExp('"', 'gi'), '');
        });
        const message: string = messages[0];
        ctx.status = 400;
        ctx.body = {
          statusCode: 400,
          success: false,
          message,
          data: {}
        };
      }
    };
  };
  
  // Custom middleware to validate request params using Joi
  export const validateRequestParams = (schema) => {
    return async (ctx, next) => {
      console.log('=>>>>>>>>>  ctx.params =>>> ', ctx.params);
      try {
        const validatedData = await schema.validateAsync(ctx.params, {
          abortEarly: false
        });
        ctx.validatedData = validatedData;
        await next();
      } catch (error) {
        let messages: Array<string> = error.details.map((err) => {
          return err.message.split("'").join('').replace(new RegExp('"', 'gi'), '');
        });
        const message: string = messages[0];
        ctx.status = 400;
        ctx.body = {
          statusCode: 400,
          success: false,
          message,
          data: {}
        };
      }
    };
  };

  export function compareVersions(version1: string, version2: string): number {
    const v1Components = version1.split('.').map(Number);
    const v2Components = version2.split('.').map(Number);
  
    const maxLength = Math.max(v1Components.length, v2Components.length);
  
    for (let i = 0; i < maxLength; i++) {
      const v1Value = i < v1Components.length ? v1Components[i] : 0;
      const v2Value = i < v2Components.length ? v2Components[i] : 0;
  
      if (v1Value < v2Value) {
        return -1; // version1 is smaller
      } else if (v1Value > v2Value) {
        return 1; // version1 is greater
      }
    }
  
    return 0; // versions are equal
  }
  
