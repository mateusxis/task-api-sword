const moment = require('moment');

const createdTask = ({ socketClient }) => {
  const getIdentifier = () => 'createdTaskEventHandler';

  const handle = async (message) => {
    const { task, user } = message;
    const notification = `The tech ${user.name} performed the task ${task.title} on date ${moment(
      task.executedAt
    ).format('D/MM/YYYY HH:mm:ss')}`;

    socketClient.send(notification);
  };

  return {
    getIdentifier,
    handle
  };
};

module.exports = createdTask;
