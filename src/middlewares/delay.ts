import { Middleware } from 'koa'
import { sleep } from '../utils'

/**
 * Sleep specific millseconds before response.
 * Usage: http://example.com/delaytest.js?sleep=500
 */
export default (opts?): Middleware => {
  return async (ctx, next) => {
    console.log(ctx.query, opts)
    let delay: any;
    if(ctx.query.sleep){
      delay = Number.parseInt(ctx.query?.sleep.toString());
    }else{
      delay = opts.ms || 2000;
    }
    await sleep(delay)
    await next()
  }
}
