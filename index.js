const container = require('./src/container');
const app = container.resolve('app');

app.start().catch((err) => {
  app.logger.error(err.stack);
  process.exit(1);
});
