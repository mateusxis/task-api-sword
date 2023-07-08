const { createContainer, asClass, asFunction, asValue } = require('awilix');

const app = require('./app');
const taskDomain = require('./domain/task');
const userDomain = require('./domain/user');
const database = require('./infra/database');
const encryption = require('./infra/encryption');
const logger = require('./infra/logger');
const middlewares = require('./interfaces/http/middlewares');
const router = require('./interfaces/http/router');
const server = require('./interfaces/http/server');
const config = require('../config');

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  config: asValue(config()),
  database: asFunction(database).singleton(),
  encryption: asFunction(encryption).singleton(),
  logger: asFunction(logger).singleton(),
  middlewares: asFunction(middlewares).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton(),
  taskDomain: asClass(taskDomain),
  userDomain: asClass(userDomain)
});

module.exports = container;
