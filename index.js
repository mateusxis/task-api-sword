const container = require('./src/container');
const server = container.resolve('server');

server.start().catch((err) => {
  server.logger.error(err.stack);
  process.exit(1);
});
