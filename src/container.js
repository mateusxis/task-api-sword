const { createContainer, asClass, asFunction, asValue } = require('awilix');

const app = require('./app');
const authService = require('./app/auth');
const taskService = require('./app/task');
const userService = require('./app/user');
const authDomain = require('./domain/auth');
const taskDomain = require('./domain/task');
const userDomain = require('./domain/user');
const authentication = require('./infra/authentication');
const database = require('./infra/database');
const encryption = require('./infra/encryption');
const logger = require('./infra/logger');
const taskRepository = require('./infra/repositories/task');
const userRepository = require('./infra/repositories/user');
const middlewares = require('./interfaces/http/middlewares');
const router = require('./interfaces/http/router');
const server = require('./interfaces/http/server');
const config = require('../config');

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  authentication: asFunction(authentication).singleton(),
  authDomain: asFunction(authDomain).singleton(),
  authService: asFunction(authService).singleton(),
  config: asValue(config()),
  database: asFunction(database).singleton(),
  encryption: asFunction(encryption).singleton(),
  logger: asFunction(logger).singleton(),
  middlewares: asFunction(middlewares).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton(),
  taskDomain: asFunction(taskDomain).singleton(),
  taskRepository: asFunction(taskRepository).singleton(),
  taskService: asFunction(taskService).singleton(),
  userDomain: asFunction(userDomain).singleton(),
  userService: asFunction(userService).singleton(),
  userRepository: asFunction(userRepository).singleton()
});

module.exports = container;
