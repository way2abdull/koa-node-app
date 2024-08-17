import nodemailer from 'nodemailer';
const smtpTransporter = nodemailer.createTransport({
	host: process.env.SYS_HOST,
	// port: process.env.SYS_PORT,
	secure: process.env.EMAIL_SECURE == 'true' ? true : false,
	auth: {
		user: process.env.SYS_USER,
		pass: process.env.SYS_PASSWORD,
	},
	tls: {
		ciphers: 'SSLv3',
	},
});

class MailManager {
	private fromEmail = process.env.SYS_EMAIL;

	async sendMail(params) {
		try {
			const mailOptions = {
				from: `BLANK DEV <${this.fromEmail}>`,
				to: params.to,
				subject: params.subject,
				html: params.html,
			};
			if (params.bcc) mailOptions['bcc'] = params['bcc'];

			await smtpTransporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Message sent: ' + info.response);
				}
			});
			return;
		} catch (error) {
			console.log(error);
		}
	}

	async sendBulkMailInvite(params) {
		try {
			return await this.sendMail({
				to: params.to,
				subject: params.subject,
				html: params.html,
			});
		} catch (error) {
			console.log(error);
		}
	}

	async sendBulkMailInviteBCC(params) {
		try {
			return await this.sendMail({
				bcc: params.to,
				subject: params.subject,
				html: params.html,
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export const mailManager = new MailManager();
