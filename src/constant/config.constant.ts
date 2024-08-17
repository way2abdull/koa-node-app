/**
 * @file config.constant
 * @description defines configuration for application
 * @created 2023-03-22
 * @author TestApp Dev Team
*/

import dotenv from "dotenv";

// system error message codes for debugging
export const SYS_ERR = {
    NODE_ENV_INVALID: 100,
    BOOTSTRAP_ERROR: 101,
    MONGO_CONN_FAILED: 103,
    REDIS_CONN_FAILED: 104
}

// check if NODE_ENV exists, else throw an error
if (typeof process.env.NODE_ENV === 'undefined') process.exit(SYS_ERR.NODE_ENV_INVALID);

// configure the environment
dotenv.config({ path: `bin/.env.${(process.env.NODE_ENV || '').trim()}` });


// configurations and credentials goes in here
export const CONFIG = {
    NODE_ENV: (process.env.NODE_ENV || '').trim(),
    DB_URI: process.env.DB_URI,
    APP: {
        PORT: process.env.PORT,
        BASE_URL: process.env.BASE_URL,
        APP_HOST: process.env.APP_HOST,
        DISPLAY_COLORS: process.env.DISPLAY_COLORS,
        WEB_ANGULAR_URL: process.env.WEB_ANGULAR_URL
    },
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SYS_MAIL_CREDS: {
        SYS_EMAIL: process.env.SYS_EMAIL,
        SYS_USER: process.env.SYS_USER,
        SYS_PASSWORD: process.env.SYS_PASSWORD,
        SYS_HOST: process.env.SYS_HOST,
        SYS_PORT: process.env.SYS_PORT,
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY

}
