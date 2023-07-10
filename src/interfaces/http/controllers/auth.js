const { OK, INTERNAL_SERVER_ERROR, FORBIDDEN, BAD_REQUEST } = require('http-status');

const authController = ({ authService }) => {
  const login = async (ctx) => {
    const { email, password } = ctx.request.body;
    try {
      const user = await authService.login({ email, password });

      ctx.status = OK;
      ctx.body = user;
    } catch (err) {
      switch (err.message) {
        case 'invalid credentials':
          ctx.status = FORBIDDEN;
          break;
        case 'invalid email or password':
          ctx.status = BAD_REQUEST;
          break;
        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };

  return {
    login
  };
};

module.exports = authController;
