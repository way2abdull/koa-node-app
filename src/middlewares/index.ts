import compose from 'koa-compose';
import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import handleErrors from './error';
import responseTime from './responseTime';
import delay from './delay';
import inputRequest from "./requestResponse";

export default function middleware() {
  return compose([
    logger(),
    handleErrors(),
    serve('./src/views'),  // static resources don't need authorization
    serve('./doc'),
    serve('./dist'),
    cors(),
    responseTime({ hrtime: true }),
    bodyParser({ 
      jsonLimit: '10mb', 
      formLimit: "10mb", 
      textLimit: "10mb",      
    }),      
    inputRequest(),
    delay({ ms: 50 })
  ])
}

