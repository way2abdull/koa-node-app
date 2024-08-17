"use strict";
import { CONFIG } from "./config.constant";

export const DBENUMS = {
  USER_GENDER: ["MALE", "FEMALE"],
  STATUS: ["ACTIVE", "INACTIVE", "DELETED"],
  ACCOUNT_STATUS: {
    ACTIVE: 1,
    BLOCKED: 0,
    DELETED: 2,
    INACTIVE: 3,
  },
  DEVICE_TYPE: {
    iOS: "0",
    ANDROID: "1",
    WEB: "2",
    ALL: "3"
  },
  SOCIAL_TYPE: {
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK",
    TWITTER: "TWITTER",
    LINKEDIN: "LINKEDIN",
    APPLE : "APPLE",
    NORMAL: "NORMAL"
  },
  USER_TYPE: {
    GUEST: "GUEST",
    CONFIRM: "CONFIRM",
    ALL: "ALL"
  },
  NOTIFICATION_STATUS: {
    DRAFT: "DRAFT",
    SENT: "SENT",
  },
  ADMIN_NOTIFICATION_TYPE: {
    PUSH: "PUSH",
    EMAIL: "EMAIL",
    SMS: "SMS"
  },
  NOTIFICATION_CHUNK_SIZE: 3000
};

export enum VERSION_UPDATE_TYPE {
  "SOFT" = "SOFT",
  "FORCEFUL" = "FORCEFUL",
  "NO" = "NO",
}

export enum STATIC_MANAGEMENT_TYPE {
  'PRIVACY_POLICY' = 'PRIVACY_POLICY',
  'TERMS_AND_CONDITIONS' = 'TERMS_AND_CONDITIONS',
  'ABOUT_US' = 'ABOUT_US',
  'FAQ' = 'FAQ',
};

export const LANGUAGE = {
  English: 'en',
  Arabic: 'ar',
};
export enum COMMON_STATUS {
  "ACTIVE" = "ACTIVE",
  "INACTIVE" = "DEACTIVATED",
  "DELETED" = "DELETED",
}

export enum REDIRECTION_TYPE {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  NO = 'NO'
}

export enum BANNER_PAGES {
  HOME_PAGE = 'HOME_PAGE',
}

export enum NOTIFICATION_TYPE {
  ADMIN = 'ADMIN',
  WELCOME = 'WELCOME',
}

export const TEMPLATE_CONST = {
  COPYRIGHT: `${new Date().getFullYear()} Test App. All Rights Reserved`,
  FB_LINK: "",
  TWITTER_LINK: "",
  INSTALL_LINK: "",
  LINKEDIN_LINK: "",
  ANDROID_LINK: "https://android.com/",
  IOS_LINK: "https://www.ios.com/",
  WEB_LINK: "",
  ADDRESS: "Appinventiv",
  APP_NAME: "Test App",
  SUPPORT_EMAIL: "testapp@yopmail.com",
};

export const ENUM = {
  UPLOAD_DIR: "process.cwd()" + "/src/uploads/",
  UPLOAD_DIR_FILE: "process.cwd()" + "/src/public/",
  UPLOAD_DIR_CSV: process.cwd() + "/src/public/",
  SUCCESS: 1,
  FAILED: 0,
  STATUS: {
    ACTIVE: 1,
    BLOCKED: 0,
    DELETED: 2,
    INACTIVE: 3,
    ENABLED: 1,
    DISABLED: 0,
    DATA_LIST: 1,
    PICKER_LIST: 2,
    CANCELLED: 2,
    PERIOD_END_CANCELLED: 5,
    PAUSED: 4,
    DATA_LIST_STRING: "page",
    PICKER_LIST_STRING: "all",
  }
};
export const SALT = 10;

export const BASE = {
  URL: <string>CONFIG.APP.BASE_URL,
  WEBAPP_URL: <string>CONFIG.APP.WEB_ANGULAR_URL,
};

export const ENVIRONMENT = {
  PRODUCTION: `production`,
  PREPROD: `preprod`,
  DEVELOPMENT: `development`,
  STAGING: "staging",
  QA: "qa",
  LOCAL: "local",
};

export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const COUNTRY_CODE_REGEX = /^\+(\d{1}\-)?(\d{1,3})$/;
export const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
export const NAME_REGEX = /^[a-zA-Z]*$/; //allows only alphabets

export let NOTIFICATION_MESSAGE = {
  TITLE: {
    MOBILE_VERIFICATION: "OTP For Mobile Verification",
    EMAIL_VERIFICATION: "OTP For Email Verification",
    FORGOT_PASSWORD: "Forgot password",
    RESEND_OTP: "Resend OTP",
    WELCOME: "Welcome to APP",
  },
  MESSAGE: {
    EMAIL_OTP_VERIFICATION: "Please enter below OTP to verify your email",
    MOBILE_OTP_VERIFICATION: "Please enter below OTP to verify your mobile number",
    FORGOT_PASSWORD: "Please use below OTP to reset your password",
    WELCOME: "Welcome to APP",
  },
};

export const JOI_ERROR_MESSAGES = {
  PASSWORD_VALIDATION:
    "Password must be atleast 8 characters, not more than 16 characters and must include at least one upper case letter, one lower case letter and one numeric digit.",
  MOBILE_REQUIRED: "Please enter mobile number",
  MOBILE_INVALID: "Enter a valid mobile number",
  COUNTRY_CODE_INVALID: "Enter valid country code",
  EMAIL_REQUIRED: "Please enter Email",
  EMAIL_INVALID: "Incorrect email format",
  EMAIL_MINMAX_FORMAT:
    "Min 5 and Max 50 characters and alphanumeric with special characters without emoticons",
  OTP_REQUIRED: "Please enter otp",
  OTP_MIN_LIMIT: "Otp should be min 4 digits",
  OTP_MAX_LIMIT: "Otp should be max 4 digits..",
  OTP_INVALID_FORMAT: "Otp should only contains numbers",
  INVALID_MONGO_ID: "Please Enter Valid mongo id",
  NAME_REQUIRED: "Please enter your Name",
  NAME_MIN_LIMIT: "Name should be min 2 characters",
  NAME_MAX_LIMIT: "Name should be max 40 characters",
  NAME_INVALID: "Name should only contain alphabets"
};

export const STRIPE = {
  ACCOUNT: {
    DEFAULT_COUNTRY: 'US',
    DEFAULT_CURRENCY: 'USD',
    DEFAULT_DESC: 'This is a default description',
    TYPE: {
      STANDARD: 'standard',
      CUSTOM: 'custom',
      EXPRESS: 'express'
    },
    BUSINESS_TYPE: 'individual',
    ONBOARDING_TYPE: {
      ACCOUNT_ONBOARDING: 'account_onboarding',
      ACCOUNT_UPDATE: 'account_update'
    },
    COUNTRY: {
      IN: 'IN',
      US: 'US'
    }
  },
  CURRENCY_TYPE: {
    INR: 'INR',
    USD: 'USD'
  },
  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
  },
  PAYMENT_METHOD: 'STRIPE',
  PAYMENT_TYPE: {
    CARD: 'CARD',
    PAYMENT_LINK: 'PAYMENT_LINK'
  }
}



export let STATUS_MSG = {
  ERROR: {
    CUSTOM_ERROR: (msg, code = 400) => {
      return {
        statusCode: code,
        success: false,
        message: msg,
        type: 'DEFAULT',
        name: 'BAD_REQUEST'
      };
    },
    BAD_REQUEST: {
      statusCode: 400,
      success: false,
      message: "BAD REQUEST",
      type: "BAD_REQUEST",
    },
    EMAIL_EXIST: {
      statusCode: 400,
      success: false,
      message: "This email is already in use, please try a different email!",
      type: "BAD_REQUEST",
    },
    PAGINATION: {
      statusCode: 400,
      success: false,
      message: "Page value can not be less than zero",
      type: "BAD_REQUEST",
    },
    HEADER_MISSING: {
      statusCode: 400,
      success: false,
      message: "Token missing",
      type: "BAD_REQUEST",
    },
    INVALID_CREDENTIALS: {
      statusCode: 400,
      success: false,
      type: "INVALID_PASSWORD",
      message: "The email or password you entered is incorrect.",
    },
    PAGE_NOT_FOUND: {
      statusCode: 400,
      success: false,
      type: "PAGE_NOT_FOUND",
      message: "Please not found!",
    },
    INVALID_LINK: {
      statusCode: 408,
      success: false,
      message: "Link expired.",
      type: "INVALID_LINK",
    },
    TOKEN_ALREADY_EXPIRED: {
      statusCode: 408,
      success: false,
      message:
        "Your session has expired. Please logout and login again to use the awesome contents.",
      type: "TOKEN_ALREADY_EXPIRED",
    },
    DB_ERROR: {
      statusCode: 400,
      success: false,
      message: "DB Error : ",
      type: "DB_ERROR",
    },
    INVALID_TOKEN: {
      statusCode: 401,
      success: false,
      message: "Invalid token provided",
      type: "INVALID_TOKEN",
    },
    UNAUTHORIZED: {
      statusCode: 401,
      success: false,
      message: "You are not authorized to perform this action",
      type: "UNAUTHORIZED",
    },
    UNAUTHORIZED_ADMIN: {
      statusCode: 408,
      success: false,
      message: "Session Expired",
      type: "UNAUTHORIZED",
    },
    MISSINING_AUTHENTICATION: (tokenType) => {
      return {
        statusCode: 401,
        success: false,
        message: "Missing authentication " + tokenType,
        type: "MISSINING_AUTHENTICATION",
      };
    },
    INVALID_API_KEY: () => {
      return {
        statusCode: 401,
        success: false,
        message: "Inavlid Api Key",
        type: "MISSINING_AUTHENTICATION",
      };
    },
    IMP_ERROR: {
      statusCode: 500,
      success: false,
      message: "Implementation Error",
      type: "IMP_ERROR",
    },
    KEYS_MISSING: {
      statusCode: 400,
      success: false,
      message: "Keys are missing",
      type: "Keys are missing",
    },
    ACCOUNT_NOT_FOUND: {
      statusCode: 401,
      success: false,
      message: "Email Not Registered",
      name: "INVALID_AUTHORIZATION",
      type: "INVALID_AUTHORIZATION",
    },
    DIFFERENT_LOGIN_SOURCE: {
      statusCode: 400,
      success: false,
      message: "You logged-in from different source, would you like to continue with this email password?",
      name: "BAD_REQUEST",
      type: "BAD_REQUEST",
    },
    USER_ACCOUNT_BLOCKED: {
      statusCode: 401,
      success: false,
      message: "Your account is Blocked! Please contact Admin.",
      name: "FORBIDDEN",
      type: "AccountDeactivated",
    },
    INVALID_PASSWORD: {
      statusCode: 400,
      success: false,
      type: "INVALID_PASSWORD",
      message: "Password is incorrect",
    },
    PASSWORD_MISMATCH: {
      statusCode: 400,
      success: false,
      type: "INVALID_PASSWORD",
      message: "Confirm password does not match new password",
    },
    EMAIL_LINK_EXPIRED: {
      statusCode: 502,
      success: false,
      message: "Your email verification link is expired!",
      type: "LINK_EXPIRED",
    },
    PHONE_NOT_EXIST: {
      statusCode: 499,
      success: false,
      message: "Mobile number does not exist.",
      type: "BAD_REQUEST",
    },
    PHONE_NOT_VERIFIED: {
      statusCode: 400,
      success: false,
      message: "The entered mobile number is .",
      type: "BAD_REQUEST",
    },
    EMAIL_NOT_EXIST: {
      statusCode: 499,
      success: false,
      message: "E-mail does not exist.",
      type: "BAD_REQUEST",
    },
    INCORRECT_OTP: {
      statusCode: 400,
      success: false,
      message: "Please enter correct OTP",
      type: "BAD_REQUEST",
    },
    OTP_EXPIRED: {
      statusCode: 400,
      success: false,
      message: "Otp is expired",
      type: "BAD_REQUEST",
    },
    OTP_LIMIT_EXCEEDED: {
      statusCode: 400,
      success: false,
      message: "Resend OTP limit exceeded, try after some time!",
      type: "BAD_REQUEST",
    },
    USER_NOT_EXIST: {
      statusCode: 400,
      success: false,
      message: "User does not exist!",
      type: "BAD_REQUEST",
    },
    USER_STATUS_ERROR: (state: string) => {
      return {
        statusCode: 401,
        success: false,
        message: `User is already ${state}`,
        type: "MISSINING_AUTHENTICATION",
      };
    },
    PHONE_NO_EXIST: {
      statusCode: 499,
      success: false,
      message: "Mobile number already exists, Please try with a new one!",
      type: "BAD_REQUEST",
    },
    EMAIL_ALREADY_EXIST: {
      statusCode: 499,
      success: false,
      message: "An Account with this email already exists, please login!",
      type: "BAD_REQUEST",
    },
    EMAIL_VERIFIED: {
      statusCode: 400,
      message: "Please verify your email first.",
      type: "BAD_REQUEST",
    },
    EMAIL_OTP_VALIDATION_EXPIRED: {
      statusCode: 502,
      success: false,
      message: "Email verification timeout!",
      type: "LINK_EXPIRED",
    },
    EMAIL_ALREADY_VERIFIED: {
      statusCode: 502,
      success: false,
      message: "Email is already verified!",
      type: "LINK_EXPIRED",
    },
    EMAIL_NOT_FOUND: {
      statusCode: 401,
      success: true,
      name: "INVALID_EMAIL",
      message: `The email address provided was not recognized.`,
    },
    SOCIAL_ACCOUNT_NOT_FOUND: {
      statusCode: 412,
      success: true,
      name: "INVALID_EMAIL",
      message: `The account with email does not exist.`,
    },
    ACTION_NOT_ALLOWED: {
      statusCode: 406,
      success: false,
      message: "Action not allowed.",
      type: "ACTION_NOT_ALLOWED",
    },
    DUPLICATE_VERSION: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'This version is already registered.'
    },
    DUPLICATE_BANNER: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'Banner with this name already exist'
    },
    DUPLICATE_NOTIFICATION: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'Notification with this name already exist'
    },
    DUPLICATE_MAINTENANCE_BANNER: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'Maintenance Banner with this name already exist'
    },
    INVALID_CONTENT_ID: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'Invalid Content Id'
    },
    INVALID_USER_ID: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'Invalid User Id'
    },
    DUPLICATE_ROLES: {
      statusCode: 400,
      success: false,
      type: 'ValidationError',
      name: 'ValidationError',
      message: 'This Role is already registered.'
    },
    CONTENT_ALREADY_EXIST: {
      statusCode: 499,
      success: false,
      message: "Content already exists!",
      type: "BAD_REQUEST",
    },
    DATA_NOT_FOUND: {
      statusCode: 404,
      success: true,
      message: "No data found",
      name: "NOT_FOUND",
      type: "NOT_FOUND",
    },
  },

  SUCCESS: {
    DEFAULT: {
      statusCode: 200,
      success: true,
      message: "Success",
      name: "DEFAULT",
    },
    FILE_UPLOAD: {
      statusCode: 200,
      success: true,
      message: "File Upload successfully",
      name: "DEFAULT",
    },
    CREATED: {
      statusCode: 200,
      success: true,
      message: "User Created Successfully",
      type: "CREATED",
    },
    PROFILE_CREATED: {
      statusCode: 200,
      success: true,
      message: "Your account has been created successfully",
      type: "CREATED",
    },
    LOGGED_IN: {
      statusCode: 200,
      success: true,
      message: "Logged In Successfully",
      type: "CREATED",
    },
    PROFILE_UPDATED: {
      statusCode: 200,
      success: true,
      message: "Profile updated Successfully",
      type: "CREATED",
    },
    UPDATED: {
      statusCode: 200,
      success: true,
      message: "Updated Successfully",
      name: "UPDATED",
    },
    LOGIN: {
      statusCode: 200,
      success: true,
      message: "Logged In Successfully",
      type: "LOGIN",
    },
    LOGOUT: {
      statusCode: 200,
      success: true,
      message: "Logged Out Successfully",
      type: "LOGOUT",
    },
    DELETED: {
      statusCode: 200,
      success: true,
      message: "Deleted Successfully",
      type: "DELETED",
    },
    EMAIL_VERIFY: {
      statusCode: 202,
      success: true,
      message: "Verification code sent to email. Please verify to login.",
      type: "EMAIL_VERIFY",
    },
    PASSWORD_CHANGE: {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      name: "UPDATED",
    },
    SET_PASSWORD: {
      statusCode: 200,
      success: true,
      message: "Set password successfully",
      name: "UPDATED",
    },
    PASSWORD_RESET: {
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
      name: "UPDATED",
    },
    OTP_SENT_MAIL: {
      statusCode: 200,
      success: true,
      message: "Otp sent on mail successfully",
      type: "CREATED",
    },
    OTP_SENT_MOBILE: {
      statusCode: 200,
      success: true,
      message: "Otp sent on mobile successfully",
      type: "CREATED",
    },
    OTP_RESENT: {
      statusCode: 200,
      success: true,
      message: "Otp re-sent successfully",
      type: "CREATED",
    },
    OTP_VERIFIED: {
      statusCode: 200,
      success: true,
      message: "Otp Verified Successfully",
      type: "CREATED",
    },
    EMPTY_RECORD: {
      statusCode: 200,
      success: true,
      message: "No record found.",
      type: "DEFAULT",
    },
    VERSION_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Version Created Successfully',
      type: 'CREATED'
    },
    VERSION_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Versions Data Fetched Successfully',
      type: 'FETCHED'
    },
    VERSION_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Version Updated Successfully',
      type: 'UPDATED'
    },
    VERSION_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Version Activated Successfully',
      type: 'UPDATED'
    },
    VERSION_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Version Deactivated Successfully',
      type: 'UPDATED'
    },
    BANNER_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Banner Created Successfully',
      type: 'CREATED'
    },
    BANNER_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Banner Fetched Successfully',
      type: 'FETCHED'
    },
    BANNER_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Banner Updated Successfully',
      type: 'UPDATED'
    },
    BANNER_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Banner Activated Successfully',
      type: 'UPDATED'
    },
    BANNER_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Banner Deactivated Successfully',
      type: 'UPDATED'
    },
    BANNER_DELETED: {
      statusCode: 200,
      success: true,
      message: 'Banner Deleted Successfully',
      type: 'UPDATED'
    },
    NOTIFICATION_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Created Successfully',
      type: 'CREATED'
    },
    NOTIFICATION_SENT: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Sent Successfully',
      type: 'CREATED'
    },
    NOTIFICATION_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Fetched Successfully',
      type: 'FETCHED'
    },
    NOTIFICATION_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Updated Successfully',
      type: 'UPDATED'
    },
    NOTIFICATION_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Activated Successfully',
      type: 'UPDATED'
    },
    NOTIFICATION_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Deactivated Successfully',
      type: 'UPDATED'
    },
    NOTIFICATION_DELETED: {
      statusCode: 200,
      success: true,
      message: 'Notifcation Deleted Successfully',
      type: 'UPDATED'
    },
    MAINTENANCE_BANNER_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Created Successfully',
      type: 'CREATED'
    },
    MAINTENANCE_BANNER_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Fetched Successfully',
      type: 'FETCHED'
    },
    MAINTENANCE_BANNER_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Updated Successfully',
      type: 'UPDATED'
    },
    MAINTENANCE_BANNER_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Activated Successfully',
      type: 'UPDATED'
    },
    MAINTENANCE_BANNER_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Deactivated Successfully',
      type: 'UPDATED'
    },
    MAINTENANCE_BANNER_DELETED: {
      statusCode: 200,
      success: true,
      message: 'Maintenance Banner Deleted Successfully',
      type: 'UPDATED'
    },
    USERS_LIST_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Users List Fetched Successfully',
      type: 'FETCHED'
    },
    USERS_DETAILS_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'User Details Fetched Successfully',
      type: 'FETCHED'
    },
    USER_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'User Activated Successfully',
      type: 'FETCHED'
    },
    USER_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'User Blocked Successfully',
      type: 'FETCHED'
    },
    ADMIN_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Admin Activated Successfully',
      type: 'FETCHED'
    },
    ADMIN_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Admin Blocked Successfully',
      type: 'FETCHED'
    },
    ROLES_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Role Created Successfully',
      type: 'CREATED'
    },
    ROLES_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Roles Data Fetched Successfully',
      type: 'FETCHED'
    },
    ROLES_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Role Updated Successfully',
      type: 'UPDATED'
    },
    ROLE_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Role Activated Successfully',
      type: 'FETCHED'
    },
    ROLE_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Role Blocked Successfully',
      type: 'FETCHED'
    },
    SUBADMIN_CREATED: {
      statusCode: 200,
      success: true,
      message: 'Sub Admin Created Successfully',
      type: 'CREATED'
    },
    SUBADMIN_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Sub Admins Data Fetched Successfully',
      type: 'FETCHED'
    },
    SUBADMIN_UPDATED: {
      statusCode: 200,
      success: true,
      message: 'Sub Admin Updated Successfully',
      type: 'UPDATED'
    },
    SUBADMIN_ACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Sub Admin Activated Successfully',
      type: 'UPDATED'
    },
    SUBADMIN_DEACTIVATED: {
      statusCode: 200,
      success: true,
      message: 'Sub Admin Deactivated Successfully',
      type: 'UPDATED'
    },
    DATA_NOT_FOUND: {
      statusCode: 204,
      success: true,
      message: "No content found",
      name: "NOT_FOUND",
      type: "NOT_FOUND",
    },
    CONTENT_CREATED: (content: string) => {
      return {
        statusCode: 200,
        success: true,
        message: `${content} Created Successfully`,
        type: 'CREATED'
      };
    },
    CONTENT_LIST_FETCHED: {
      statusCode: 200,
      success: true,
      message: 'Content Fetched Successfully',
      type: 'FETCHED'
    },
    CONTENT_ACTIVATED: {
        statusCode: 200,
        success: true,
        message: 'Content Activated Successfully',
        type: 'UPDATED'
    },
    CONTENT_DEACTIVATED: {
        statusCode: 200,
        success: true,
        message: 'Content Deactivated Successfully',
        type: 'UPDATED'
    },
    CONTENT_UPDATED: (content: string) => {
      return {
        statusCode: 200,
        success: true,
        message: `${content} Updated Successfully`,
        type: 'UPDATED'
      };
    },
    CONTENT_REMOVE: {
      statusCode: 200,
      success: true,
      message: 'Content Removed Successfully',
      type: 'DELETED'
    },
  },
};
