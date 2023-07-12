const taskService = ({ messageWriter, taskDomain, config }) => {
  const list = async ({ user }) => {
    const task = await taskDomain.list({ userId: user.id, role: user.role });

    return task;
  };

  const remove = async ({ id, user }) => {
    const task = await taskDomain.remove({ id, role: user.role });

    return task;
  };

  const save = async ({ user, task: { executedAt, summary, title } }) => {
    const task = await taskDomain.save({ executedAt, summary, title, userId: user.id, role: user.role });
    if (task.executedAt)
      messageWriter.send(config.nsq.messagingTopicCreatedTask, { user: ({ id, name } = user), task });

    return task;
  };

  const update = async ({ user, task: { id, executedAt, summary, title } }) => {
    const task = await taskDomain.update({ id, executedAt, summary, title, userId: user.id, role: user.role });
    if (task.executedAt)
      messageWriter.send(config.nsq.messagingTopicUpdatedTask, { user: ({ id, name } = user), task });

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
