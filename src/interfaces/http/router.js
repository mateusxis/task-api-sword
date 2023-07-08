const { OK, INTERNAL_SERVER_ERROR } = require('http-status');
const Router = require('koa-router');

module.exports = () => {
  const router = new Router();

  router.get('/liveness', async (ctx) => {
    ctx.status = OK;
    ctx.body = 'OK';
  });

  router.get('/readiness', async (ctx) => {
    const readiness = true;

    ctx.status = readiness ? OK : INTERNAL_SERVER_ERROR;
    ctx.body = readiness ? 'OK' : 'NOK';
  });

  return router;
};
