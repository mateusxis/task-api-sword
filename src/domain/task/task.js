const { attributes } = require('structure');

const taskDomain = ({ logger, taskRepository }) => {
  const MAP_TASK_GET = {
    DEV: taskRepository.listByUserId,
    MANAGER: taskRepository.listAll
  };

  const LIST_ROLES_WITH_EXCLUSION = ['MANAGER'];
  const LIST_ROLES_WITH_UPDATE = ['DEV'];
  const LIST_ROLES_WITH_CREATE = ['DEV'];

  const Task = attributes({
    id: Number,
    title: {
      type: String,
      maxLength: 150
    },
    summary: {
      type: String,
      maxLength: 2500
    },
    userId: {
      type: Number,
      required: true
    },
    createdAt: Date,
    executedAt: Date,
    updatedAt: Date
  })(class Task {});

  const getIdentifier = (origin) => `TaskDomain ${origin}`;

  const validate = ({ id, summary, title, userId, executedAt, createdAt, updatedAt }) => {
    const task = new Task({ id, summary, title, userId, executedAt, createdAt, updatedAt });
    const { valid, errors } = task.validate({ id, summary, title, userId, executedAt, createdAt, updatedAt });

    return { valid, errors, data: task.toJSON() };
  };

  const list = async ({ userId, role }) => {
    const find = MAP_TASK_GET[`${role}`];

    if (!find) {
      const error = new Error(`your role does not exist`);
      logger.error(error.message, {
        identifier: getIdentifier('listTasks'),
        params: { userId, role }
      });
      throw error;
    }

    const task = await find({ userId });

    return task;
  };

  const remove = async ({ id, role }) => {
    if (!LIST_ROLES_WITH_EXCLUSION.includes(role)) {
      const error = new Error('you do not have permission to delete task');
      logger.error(error.message, {
        identifier: getIdentifier('removeTask'),
        params: { id, role }
      });
      throw error;
    }

    const task = await taskRepository.remove({ id });

    return task;
  };

  const save = async ({ executedAt, summary, title, userId, role }) => {
    if (!LIST_ROLES_WITH_CREATE.includes(role)) {
      const error = new Error('you do not have permission to create task');
      logger.error(error.message, {
        identifier: getIdentifier('saveTask'),
        params: { executedAt, summary, title, userId, role }
      });
      throw error;
    }

    const { valid, errors, data } = validate({ executedAt, summary, title, userId });
    if (!valid) {
      const error = new Error('there are one or more invalid fields');
      error.errors = errors;
      logger.error(error.message, {
        identifier: getIdentifier('saveTask'),
        errors,
        params: { executedAt, summary, title, userId }
      });
      throw error;
    }

    const task = await taskRepository.save({
      userId: data.userId,
      summary: data.summary,
      title: data.title,
      executedAt: data.executedAt
    });

    return task;
  };

  const update = async ({ id, executedAt, summary, title, userId, role }) => {
    if (!LIST_ROLES_WITH_UPDATE.includes(role)) {
      const error = new Error('you do not have permission to update task');
      logger.error(error.message, {
        identifier: getIdentifier('updateTask'),
        params: { id, executedAt, summary, title, userId, role }
      });
      throw error;
    }

    const { valid, errors, data } = validate({ id, executedAt, summary, title, userId });
    if (!valid) {
      const error = new Error('there are one or more invalid fields');
      error.errors = errors;
      logger.error(error.message, {
        identifier: getIdentifier('updateTask'),
        errors,
        params: { id, executedAt, summary, title, userId }
      });
      throw error;
    }

    const task = await taskRepository.update({
      summary: data.summary,
      title: data.title,
      executedAt: data.executedAt,
      userId: data.userId,
      id: data.id
    });

    return task;
  };

  return {
    list,
    remove,
    save,
    validate,
    update
  };
};

module.exports = taskDomain;
