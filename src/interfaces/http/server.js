const Koa = require('koa');
module.exports = ({ config, router }) => {
  const app = new Koa();

  app.use(router.routes());

  const start = () =>
    new Promise(() => {
      app.listen(config.serverPort, () => {
        console.log(`Server listening on ${config.serverPort}`);
      });
    });

  return {
    start
  };
};
