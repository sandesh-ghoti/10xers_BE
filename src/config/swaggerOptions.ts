import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '10xers API',
      version: '1.0.0',
      description: 'Backend APIs for 10xers App',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local dev server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts', './src/models/**/*.ts'],
};
