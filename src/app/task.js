const taskService = ({ taskDomain }) => {
  const list = async ({ user }) => {
    const task = await taskDomain.list({ userId: user.id, role: user.role });

    return task;
  };

  const remove = async ({ id, user }) => {
    const task = await taskDomain.remove({ id, role: user.role });

    return task;
  };

  const save = async ({ userId, summary }) => {
    const task = await taskDomain.save({ userId, summary });

    return task;
  };

  const update = async ({ summary, executedAt, userId, id }) => {
    const task = await taskDomain.update({ summary, executedAt, userId, id });

    return task;
  };

  return {
    list,
    remove,
    save,
    update
  };
};

module.exports = taskService;
