import { CONFIG } from "./constant";
import Koa from 'koa';
import middleware from './middlewares';
import routes from './routes';
import cors from '@koa/cors';
const app = new Koa();
const mount = require('koa-mount');
import serve from 'koa-static';
import connectDatabase from './db/mongoose';
import RedisDAO from './db/redis';
import { consoleData } from './utils';
import { S3upload } from './utils/aws.s3.utils'
import { smsModule } from "./utils/sms/twilio";

app.use(mount('/static', serve(process.cwd() + '/src/public')))
app.use(mount('/staticjson', serve(process.cwd() + '/uploads')))
app.use(serve(process.cwd() + '/swagger'));
app.use(cors())
app.use(middleware());
app.use(routes());
app.use(serve(process.cwd() + '/public'));
//test 
(async () => {
  const displayColors = CONFIG.APP.DISPLAY_COLORS
  try {
    consoleData(CONFIG.NODE_ENV, 'xxxxxxxxxxxxxxxxx---Environemnt---xxxxxxxxxxxxxxxxxxxxxxxxx');
    const port = CONFIG.APP.PORT;
    const appHost = CONFIG.APP.BASE_URL;
    let db = await connectDatabase();
    let redis = await RedisDAO.connect();
    await S3upload.initializeAWS();
    await smsModule.initializeTwilio();
    app.proxy = true;
    const server = app.listen(port);

    console.info(displayColors ? '\x1b[32m%s\x1b[0m' : '%s', `Listening to ${appHost}:${port}`);
  } catch (err) {
    console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', err);
  }
})()