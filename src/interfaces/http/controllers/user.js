const { OK, CREATED, CONFLICT, INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('http-status');

const userController = ({ userService }) => {
  const get = async (ctx) => {
    const { id } = ctx.state.user;

    try {
      const user = await userService.getById({ id });
      ctx.status = OK;
      ctx.body = user;
    } catch (err) {
      ctx.status = INTERNAL_SERVER_ERROR;
      ctx.body = err;
    }
  };

  const save = async (ctx) => {
    const { name, email, password, role } = ctx.request.body;

    try {
      const user = await userService.save({ name, email, password, role });
      ctx.status = CREATED;
      ctx.body = user;
    } catch (err) {
      console.log(err.message);
      switch (err.message) {
        case 'existed user':
          ctx.status = CONFLICT;
          break;
        case 'there are one or more invalid fields':
          ctx.status = BAD_REQUEST;
          break;
        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };

  return {
    get,
    save
  };
};

module.exports = userController;
