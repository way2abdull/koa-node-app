import { CONFIG } from "../constant";
import { connect, set, connection as db } from 'mongoose';
export default async function connectDatabase() {
  const displayColors = CONFIG.APP.DISPLAY_COLORS;
  console.log('MongoDB URI:', CONFIG);
  const dbUrl = CONFIG.DB_URI;

  
  
  set('debug', true)
  db.on('error', err => {

    console.error('%s', err)
  })
  db.on('close', () => {
    console.log('Database connection closed.')
  })
  connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 200
  }, function(error){
    if(!error){
      console.log("MongoDB connected successfully")
    }
    
  })

  db.on('disconnected', async function () {
    console.log('MongoDB disconnected!');
  });
  console.info(displayColors ? '\x1b[32m%s\x1b[0m' : '%s', `Connected to ${dbUrl}`)
  return
}


