const { OK, INTERNAL_SERVER_ERROR } = require('http-status');
const Router = require('koa-router');

module.exports = ({ database, logger, authController, taskController, userController, middlewares }) => {
  const router = new Router();

  router.post('/login', authController.login);

  router.get('/tasks', middlewares.authMiddleware, taskController.list);
  router.post('/tasks', middlewares.authMiddleware, taskController.save);
  router.put('/tasks/:id', middlewares.authMiddleware, taskController.update);
  router.delete('/tasks/:id', middlewares.authMiddleware, taskController.remove);
  
  router.post('/users', userController.save);
  router.get('/me', middlewares.authMiddleware, userController.get);

  router.get('/liveness', async (ctx) => {
    ctx.status = OK;
    ctx.body = 'OK';
  });

  router.get('/readiness', async (ctx) => {
    let databaseReadiness;

    try {
      databaseReadiness = await database.$metrics.json();
    } catch (err) {
      logger.error(err);
    }

    const readiness = Boolean(databaseReadiness);

    ctx.status = readiness ? OK : INTERNAL_SERVER_ERROR;
    ctx.body = readiness ? 'OK' : 'NOK';
  });

  return router;
};
