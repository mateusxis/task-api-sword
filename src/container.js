const { createContainer, asFunction, asValue } = require('awilix');

const app = require('./app');
const config = require('../config');
const router = require('./interfaces/http/router');
const server = require('./interfaces/http/server');

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  config: asValue(config()),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton()
});

module.exports = container;
