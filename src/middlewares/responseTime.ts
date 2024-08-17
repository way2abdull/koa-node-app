import { Middleware, Context } from 'koa'

export default (opts?): Middleware => {
    return async (ctx: Context, next) => {
        try {
            let hrtime = opts && opts.hrtime;
            let start = process.hrtime();
            return next().then(() => {
                let time = process.hrtime(start);

                // Format to high resolution time with nano time
                let delta = time[0] * 1000 + time[1] / 1000000;
                if (!hrtime) {
                    // truncate to milliseconds.
                    delta = Math.round(delta);
                }
                ctx.set('X-Response-Time', delta + 'ms');
            });
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
