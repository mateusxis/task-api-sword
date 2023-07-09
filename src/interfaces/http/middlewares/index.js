const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const authMiddleware = require('./auth');
const loggerMiddleware = require('./logger');

module.exports = ({ authentication,config }) => ({
  bodyParserMiddleware: () => bodyParser({ enableTypes: ['json'] }),
  compressMiddleware: compress,
  corsMiddleware: () =>
    cors({
      origin: [`${config.baseUrl}:${config.serverPort}`],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }),
  helmetMiddleware: helmet,
  authMiddleware: authMiddleware({authentication}),
  loggerMiddleware
});
