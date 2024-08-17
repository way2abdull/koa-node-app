import twilio from 'twilio';
import { ENVIRONMENT } from '../../constant/appConstants';
import { ICommonInterface } from '../../interfaces/common.interface';
export var client = undefined;

class SMSModule {
	async initializeTwilio(): Promise<void> {
		if(process.env.TWILIO_SWITCH_ON == 'true') {
			client = twilio(
				process.env.TWILIO_ACCOUNT_SID,
				process.env.TWILIO_AUTH_TOKEN,
			);
			console.info("Twilio initialized successfully..")
		}
	}

    async sendSMS({ to, message }: ICommonInterface.SendMessage) {
		try {
			if (
				(process.env.ENV_NAME == ENVIRONMENT.PRODUCTION
				||
				process.env.ENV_NAME == ENVIRONMENT.PREPROD) && process.env.TWILIO_SWITCH_ON == 'true'
			) {
				const sentMessage = await client.messages.create({
					body: message,
					from: process.env.TWILIO_NUMBER,
					to: to,
				});
				return `SMS sent with message SID: ${sentMessage.sid}`;
			} else if (to == '+918175844802' && process.env.TWILIO_SWITCH_ON == 'true') {
				const sentMessage = await client.messages.create({
					body: message,
					from: process.env.TWILIO_NUMBER,
					to: to,
				});
				console.info(`SMS sent with message SID: ${sentMessage.sid}`)
				return `SMS sent with message SID: ${sentMessage.sid}`;
			} else return;
		} catch (error) {
			throw error;
		}
	}
}

export const smsModule = new SMSModule();


