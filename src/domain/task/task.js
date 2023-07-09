const { attributes } = require('structure');

const taskDomain = ({ logger, taskRepository }) => {
  const MAP_TASK_GET = {
    DEV: taskRepository.getByUserId,
    MANAGER: taskRepository.getAll
  };

  const LIST_ROLES_WITH_EXCLUSION = ['MANAGER'];

  const Task = attributes({
    id: Number,
    summary: {
      type: String,
      maxLength: 2500
    },
    userId: {
      type: Number,
      required: true
    },
    executedAt: Date,
    createdAt: Date
  })(class Task {});

  const validate = ({ id, summary, userId, executedAt, createdAt }) => {
    const task = new Task({ id, summary, userId, executedAt, createdAt });
    const { valid, errors } = task.validate({ id, summary, userId, executedAt, createdAt });

    return { valid, errors, data: task.toJSON() };
  };

  const get = async ({ userId, role }) => {
    const find = MAP_TASK_GET[`${role}`];

    if (!find) {
      const error = new Error(`Your role ${role} does not exist`);
      logger.error(error);
      throw error;
    }

    const task = await find({ userId });

    return task;
  };

  const remove = async ({ id, role }) => {
    if (!LIST_ROLES_WITH_EXCLUSION.includes(role)) {
      const error = new Error(`You don't have permission to delete task ${id}`);
      logger.error(error);
      throw error;
    }

    const task = await taskRepository.remove({ id });

    return task;
  };

  const save = async ({ summary, userId }) => {
    const { valid, errors, data } = validate({ userId, summary });
    if (!valid) {
      logger.error(errors);
      const error = new Error('There are one or more invalid fields');
      error.errors = errors;
      throw error;
    }

    const task = await taskRepository.save({ userId: data.userId, summary: data.summary });

    return task;
  };

  const update = async ({ summary, executedAt, userId, id }) => {
    const { valid, errors, data } = validate({ summary, executedAt, userId, id });
    if (!valid) {
      logger.error(errors);
      const error = new Error('There are one or more invalid fields');
      error.errors = errors;
      throw error;
    }

    const task = await taskRepository.update({
      summary: data.summary,
      executedAt: data.executedAt,
      userId: data.userId,
      id: data.id
    });

    return task;
  };

  return {
    get,
    remove,
    save,
    validate,
    update
  };
};

module.exports = taskDomain;
