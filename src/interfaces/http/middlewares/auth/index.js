const { INTERNAL_SERVER_ERROR, FORBIDDEN, BAD_REQUEST } = require('http-status');

const authMiddleware = ({ authentication }) => {
  return async (ctx, next) => {
    const { authorization } = ctx.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
      const user = authentication.verify(token);
      ctx.state.user = user;

      await next();
    } catch (err) {
      switch (err.message) {
        case 'jwt expired':
          ctx.status = FORBIDDEN;
          break;

        case 'invalid signature':
          ctx.status = BAD_REQUEST;
          break;

        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };
};

module.exports = authMiddleware;
