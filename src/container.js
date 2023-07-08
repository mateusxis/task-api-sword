const { createContainer, asFunction } = require('awilix');

const app = require('./app');
const router = require('./interfaces/http/router');
const server = require('./interfaces/http/server');

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton()
});

module.exports = container;
