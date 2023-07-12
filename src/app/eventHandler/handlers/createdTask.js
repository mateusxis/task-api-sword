const moment = require('moment');

const createdTask = () => {
  const getIdentifier = () => 'createdTaskEventHandler';

  const handle = async (message) => {
    const { task, user } = message;
    const notification = `The tech ${user.name} performed the task ${task.title} on date ${moment(
      task.updatedAt
    ).format('D/MM/YYYY HH:mm:ss')}`;
    console.log(notification);
  };

  return {
    getIdentifier,
    handle
  };
};

module.exports = createdTask;
