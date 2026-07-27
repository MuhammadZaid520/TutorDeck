const app = require('../backend/dist/index');
const serverless = require('serverless-http');

module.exports = serverless(app.default || app);
