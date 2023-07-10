const { OK, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('http-status');

const taskController = ({ taskService }) => {
  const list = async (ctx) => {
    const { user } = ctx.state;
    try {
      const tasks = await taskService.list({ user });

      ctx.status = OK;
      ctx.body = tasks;
    } catch (err) {
      switch (err.message) {
        case 'your role does not exist':
          ctx.status = BAD_REQUEST;
          break;
        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };

  const remove = async (ctx) => {
    const { id } = ctx.params;
    const { user } = ctx.state;

    try {
      const task = await taskService.remove({ id, user });

      ctx.status = OK;
      ctx.body = task;
    } catch (err) {
      switch (err.message) {
        case 'you do not have permission to delete task':
          ctx.status = FORBIDDEN;
          break;
        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };

  const save = async (ctx) => {
    const { summary } = ctx.request.body;
    const { id: userId } = ctx.state.user;

    try {
      const task = await taskService.save({ userId, summary });

      ctx.status = CREATED;
      ctx.body = task;
    } catch (err) {
      switch (err.message) {
        case 'there are one or more invalid fields':
          ctx.status = BAD_REQUEST;
          break;
        default:
          ctx.status = INTERNAL_SERVER_ERROR;
      }
      ctx.body = err;
    }
  };

  const update = async (ctx) => {
    const { id } = ctx.params;
    const { summary, executedAt, userId } = ctx.request.body;

    try {
      const task = await taskService.update({ summary, executedAt, userId, id });

      ctx.status = OK;
      ctx.body = task;
    } catch (err) {
      switch (err.message) {
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
    list,
    remove,
    save,
    update
  };
};

module.exports = taskController;
