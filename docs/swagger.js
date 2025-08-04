const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My App API',
      version: '1.0.0',
      description: 'Swagger documentation for your API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: [path.resolve(__dirname, '../routes/*.js')], // ✅ صح
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
