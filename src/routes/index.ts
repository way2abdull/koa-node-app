import compose from 'koa-compose';
import Router from 'koa-router';
import { Context } from 'koa';

import CommonRoutes from './common.routes';
import UserRoutes from './v1/user.routes';
import AdminRoutes from './v1/admin.routes';
import versionRoutes from './v1/version.routes';
import ContentRoutes from './v1/staticContent.routes';
import roleRoutes from './v1/roles.routes';
import subadminRoutes from './v1/subadmin.routes';
// import subadminRoutes from './v1/subadmin.routes';
import BannerRoutes from './v1/banner.routes';
import MaintenanceBannerRoutes from './v1/maintenanceBanner.routes';
import { swaggerFunc } from '../lib/swagger';
import { TemplateUtil } from '../utils/templateUtils';

import { CONFIG } from '../constant';
import StripeRoutes from './v1/stripe.routes';

const children = [
  { routes: CommonRoutes, prefix: '/v1/common' },
  { routes: UserRoutes, prefix: '/v1/user' },
  { routes: AdminRoutes, prefix: '/v1/admin' },
  { routes: StripeRoutes, prefix: '/v1/stripe' },
  { routes: versionRoutes, prefix: '/v1/admin/version'},
  { routes: ContentRoutes, prefix: '/v1/admin/content'},
  { routes: roleRoutes, prefix: '/v1/admin/roles'},
  { routes: subadminRoutes, prefix: '/v1/admin/subadmin'},
  // { routes: subadminRoutes, prefix: '/v1/admin/subadmin'},
  { routes: BannerRoutes, prefix: '/v1/admin/banner'},
  { routes: MaintenanceBannerRoutes, prefix: '/v1/admin/maintenance-banner'},
]

export default function routes() {
  const router = new Router()
  router
    .get('/api', (ctx: Context) => {
      ctx.body = router.stack.map(i => i.path)
    })
    .get('/swagger.json', async (ctx: Context) => {
      try {
        return ctx.body = swaggerFunc()
      } catch (err) {
        console.log(err)
      }
    })
    .get('/api-doc', async (ctx: Context) => {
      try {

        ctx.type = 'html'
        let html = await new TemplateUtil(process.cwd() + '/swagger/index.html').compileFile({
          url: CONFIG.APP.APP_HOST
        })
        console.log(html);
        return ctx.body = html;
      } catch (err) {
        console.log(err)
      }
    })
    .get('/echo', (ctx: Context) => {
      ctx.body = { method: ctx.method, headers: ctx.headers, params: ctx.request.body }
    })

    //Mehthod 1
    .get('/downloadxls/:filename', (ctx: Context) => {            
      const { filename } = ctx.params;
      console.log('----------s-------------------',process.cwd() + '/src/public/upload/'+filename);
    });

  // Nested routers
  children.forEach(child => {
    const nestedRouter = new Router()
    child.routes(nestedRouter)
    router.use(child.prefix, nestedRouter.routes(), nestedRouter.allowedMethods())
  })
  return compose([router.routes(), router.allowedMethods()])
}