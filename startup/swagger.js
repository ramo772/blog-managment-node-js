const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../docs/swagger')

module.exports = function (app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

