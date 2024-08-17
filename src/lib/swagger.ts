const swaggerJSDoc = require('swagger-jsdoc');
import { CONFIG } from "../constant";

export const swaggerFunc = () => {

    var swaggerDefinition = {
        
        info: {
            title: 'Test App',
            version: '2.0.0',
            description: 'Test App api doc.',
        },
        host: CONFIG.APP.APP_HOST,
        basePath: '/',
        schemes:['http','https'],
        securityDefinitions: {
            BasicAuth: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            },
            BearerAuth: {
                type: 'apiKey',
                name: 'Authentication',
                in: 'header'
              },
          },
          
          
    };

    
    const options = {
        swaggerDefinition: swaggerDefinition,
        apis: [process.cwd() + '/src/routes/*/*.ts']
    };

    const swaggerSpec = swaggerJSDoc(options);
    return swaggerSpec
}