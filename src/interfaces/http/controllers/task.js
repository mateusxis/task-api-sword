const taskController = ({ taskService }) => {
  const get = async (ctx) => {
    const { user } = ctx.state;
    const tasks = await taskService.getById({ user });

    ctx.body = tasks;
    ctx.status = 200;
  };

  const remove = async (ctx) => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const task = await taskService.remove({ id, user });

    ctx.body = task;
  };

  const save = async (ctx) => {
    const { summary } = ctx.request.body;
    const { id: userId } = ctx.state.user;
    const task = await taskService.save({ userId, summary });

    ctx.body = task;
  };

  const update = async (ctx) => {
    const { id } = ctx.params;
    const { summary, executedAt, userId } = ctx.request.body;
    const task = await taskService.update({ summary, executedAt, userId, id });

    ctx.body = task;
  };

  return {
    get,
    remove,
    save,
    update
  };
};

module.exports = taskController;
