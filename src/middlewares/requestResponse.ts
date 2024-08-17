import { Middleware, Context } from 'koa'
import koaBody from 'koa-body';
import { STATUS_MSG } from "../constant/index";
import * as utils from '../utils';

export default (opts?): Middleware => {
    try {
        return async (ctx: Context, next) => {

            let executionTime;
            let startTime = utils.getDate().getTime();
            ctx.res.on('finish', () => {
                executionTime = utils.getDate().getTime() - startTime;

                let requestResponseData = {
                    'request': {
                        'query': ctx.request.query,
                        'path': ctx.path,
                        'method': ctx.method,
                        'pathParams': ctx.params
                    },
                    'response': {
                      //  'statusCode': (ctx.body && ctx.request.body.statusCode) ? ctx.request.body.statusCode : STATUS_MSG.ERROR.BAD_REQUEST.statusCode,
                      //  'message': (ctx.body && ctx.request.body.message) ? ctx.request.body.message : STATUS_MSG.ERROR.BAD_REQUEST.message
                    },
                    'ip': ctx.request.ip,
                    'executionTime': executionTime,
                    'createdOn': utils.getDate(),
                    'userId': ctx.state.user ? ctx.state.user._id : null
                }

                // requestResponse.createOneEntity(requestResponseData)
            })

            console.log("******************Input request****************", "\n")
            console.log("Method ****************", ctx.method, "\n");
            console.log("Path ******************", ctx.path, "\n");
            console.log("Query params **********", ctx.request.query, "\n");
            console.log("Body ******************", ctx.request.body, "\n");
            console.log("HEADER ******************", ctx.request.header, "\n");
            console.log("********************End***********************", "\n")

            console.log("********************End***********************", "\n")
            
            await next()
        }
    }
    catch (error) {
        console.log("Middleware: error in requst response middleware reqreesp", error)
        Promise.reject(error)
    }
}