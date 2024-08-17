import { smsModule } from "./twilio";

class SMSNotificationModule {
  async sendSMSForTest(number: string, message: string) {
    try {
      if ( number != "" && number != null ) {
        console.info("sendSMSForTest", number, message);
        smsModule.sendSMS({
          to: number,
          message: message,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
export const smsNotify = new SMSNotificationModule();
