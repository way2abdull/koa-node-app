import admin from "firebase-admin";
import { DBENUMS } from "../../constant/appConstants";

interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

class PushModule {
  private app: admin.app.App;
  private messaging: admin.messaging.Messaging;

  async initializeFirebase(): Promise<void> {
    let fbconfig: FirebaseConfig;
    try {
      fbconfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      };
    } catch (err) {
      console.error("Error fetching secret values:", err);
      return;
    }

    // Initialize Firebase APP
    this.app = admin.initializeApp({
      credential: admin.credential.cert(fbconfig),
    });
    this.messaging = this.app.messaging();
  }

  async sendPush(registrationTokens: any, payload: any) {
    try {
      if (registrationTokens && typeof registrationTokens != undefined) {
        const notificationResponse = await this.messaging.sendEachForMulticast({
          tokens: registrationTokens,
          notification: payload.notification,
          data: payload.data,
        });
        console.log(
          "notificationResponse---->",
          JSON.stringify(notificationResponse)
        );
        return;
      }
    } catch (error) {
      console.error(`We have an error in push notification=> ${error}`);
      console.error(`Error Deatil => ${JSON.stringify(error)}`);
      return {};
    }
  }

  async sendGenericNotification(token) {
    try {
      const payload = {
        data: {
          title: "DEV Testing Notification",
          body: "Welcome To DEV APP",
          sentTime: new Date().getTime().toString(),
          sound: "default",
        },
        notification: {
          title: "DEV Testing Notification",
          body: "Welcome To DEV APP",
        },
        android: {
          ttl: "86400s",
          notification: {
            click_action: "OPEN_ACTIVITY_1",
            image: "",
          },
        },
        apns: {
          headers: {
            "apns-priority": "5",
          },
          payload: {
            aps: {
              "mutable-content": 1,
            },
          },
          fcm_options: {
            image: "",
          },
        },
        webpush: {
          headers: {
            TTL: "86400",
          },
        },
      };
      return this.sendPush([token], payload);
    } catch (error) {
      throw error;
    }
  }

  async devicePayloadFormat(payload: any) {
    try {
      if (payload?.platform === DBENUMS.DEVICE_TYPE.iOS) {
        return {
          data: {
            title: payload.title,
            body: payload.message,
            sentTime: new Date().getTime().toString(),
            sound: "default",
            appData: payload?.appData,
            userId: payload?.userId,
          },
          notification: {
            title: payload.title,
            body: payload.message,
          },
          android: {
            ttl: "86400s",
            notification: {
              click_action: "OPEN_ACTIVITY_1",
              image: "",
            },
          },
          apns: {
            headers: {
              "apns-priority": "5",
            },
            payload: {
              aps: {
                "mutable-content": 1,
              },
            },
            fcm_options: {
              image: payload?.image,
            },
          },
          webpush: {
            headers: {
              TTL: "86400",
            },
          },
        };
      } else if (payload.platform === DBENUMS.DEVICE_TYPE.WEB) {
        return {
          data: {
            title: payload.title,
            body: payload.message,
            sentTime: new Date().getTime().toString(),
            sound: "default",
            appData: payload?.appData,
            userId: payload?.userId,
          },
          notification: {
            title: payload.title,
            body: payload.message,
          },
          android: {
            ttl: "86400s",
            notification: {
              click_action: "OPEN_ACTIVITY_1",
              image: "",
            },
          },
          apns: {
            headers: {
              "apns-priority": "5",
            },
            payload: {
              aps: {
                "mutable-content": 1,
              },
            },
            fcm_options: {
              image: "",
            },
          },
          webpush: {
            headers: {
              TTL: "86400",
            },
          },
        };
      } else if (payload.platform === DBENUMS.DEVICE_TYPE.ANDROID) {
        return {
          data: {
            title: payload.title,
            body: payload.message,
            sentTime: new Date().getTime().toString(),
            sound: "default",
            appData: payload?.appData,
            userId: payload?.userId,
          },
          notification: {
            title: payload.title,
            body: payload.message,
          },
          android: {
            ttl: "86400s",
            notification: {
              click_action: "OPEN_ACTIVITY_1",
              image: "",
            },
          },
          apns: {
            headers: {
              "apns-priority": "5",
            },
            payload: {
              aps: {
                "mutable-content": 1,
              },
            },
            fcm_options: {
              image: payload?.image,
            },
          },
          webpush: {
            headers: {
              TTL: "86400",
            },
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async sendNotificationForAdmin(data, tokens) {
    if (tokens.length > 0) {
      const notificationData = await this.devicePayloadFormat(data);
      await this.sendPush([tokens], notificationData);
      return;
    }
  }
}
export const pushNotification = new PushModule();
