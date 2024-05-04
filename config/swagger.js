const config = require('./config');

module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NucleusDAO',
      version: '1.0.0',
      description: 'NucleusDAO Backend API documentation',
    },
    servers: [
      {
        url: config.serverUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Authorization header using the Bearer scheme',
      },
    },
    security: [
      {
        JWT: [],
      },
    ],
  },
  apis: ['./models/*.js', './routes/*.js'],
};
