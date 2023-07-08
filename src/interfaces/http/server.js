const Koa = require('koa');
module.exports = ({ config, logger, middlewares, router }) => {
  const app = new Koa();

  app
    .use(middlewares.loggerMiddleware(logger))
    .use(middlewares.helmetMiddleware())
    .use(middlewares.compressMiddleware())
    .use(middlewares.corsMiddleware())
    .use(middlewares.bodyParserMiddleware())
    .use(router.routes());

  const start = () =>
    new Promise(() => {
      app.listen(config.serverPort, () => {
        logger.info(`Server listening on ${config.serverPort}`);
      });

      setTimeout(() => {
        throw 'test'
      }, 3000)
    });

  return {
    start
  };
};
