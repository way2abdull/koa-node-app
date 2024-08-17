import handlebars from 'handlebars'
import { TEMPLATE_CONST } from '../constant/appConstants';

export class TemplateUtil {
    private fs = require('fs');
    private template: string;
    constructor(template: any) {
        this.template = template
    }
    compileFile(complieData: Object) {
        return new Promise((resolve, reject) => {
            complieData['fbLink'] = TEMPLATE_CONST.FB_LINK
            complieData['twitterLink'] = TEMPLATE_CONST.TWITTER_LINK
            complieData['instalLink'] = TEMPLATE_CONST.INSTALL_LINK
            complieData['linkedInLink'] = TEMPLATE_CONST.LINKEDIN_LINK
            complieData['androidLink'] = TEMPLATE_CONST.ANDROID_LINK
            complieData['iosLink'] = TEMPLATE_CONST.IOS_LINK
            complieData['supportEmail'] = TEMPLATE_CONST.SUPPORT_EMAIL
            complieData['webLink'] =TEMPLATE_CONST.WEB_LINK
            complieData['gsgAddress'] = TEMPLATE_CONST.ADDRESS
            complieData['appName'] = TEMPLATE_CONST.APP_NAME

            complieData['copyright'] = TEMPLATE_CONST.COPYRIGHT

            this.fs.readFile(this.template, 'utf8', (err: Error, content: any) => {
                if (err)
                    reject(err);
                try {
                    const template = handlebars.compile(content)
                    let html = template(complieData)
                    resolve(html)
                } catch (err) {
                    reject(err)
                }
            })
        });
    }
}