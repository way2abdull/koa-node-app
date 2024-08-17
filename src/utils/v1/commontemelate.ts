import handlebars from 'handlebars'
export class CommonTemplateUtil {
    private fs = require('fs');
    private template: string;
    constructor(template) {
        this.template = template
    }
    compileFile(complieData: Object) {
        return new Promise((resolve, reject) => {
            this.fs.readFile(this.template, 'utf8', (err, content) => {
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