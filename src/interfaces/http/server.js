const Koa = require('koa');
const port = 3000;
module.exports = ({ router }) => {
  const app = new Koa();

  app.use(router.routes());

  const start = () =>
    new Promise(() => {
      app.listen(port, () => {
        console.log(`Server listening on ${port}`);
      });
    });

  return {
    start
  };
};
