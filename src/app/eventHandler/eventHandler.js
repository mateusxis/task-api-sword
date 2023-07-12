const createdTaskEventHandler = require('./handlers/createdTask');
const updatedTaskEventHandler = require('./handlers/updatedTask');

module.exports = ({ messageReader, logger, config, socketClient }) => {
  const initialize = async () => {
    const eventHandlersMapping = [
      {
        topic: {
          key: 'MESSAGING_TOPIC_CREATED_TASK',
          value: config.nsq.messagingTopicCreatedTask
        },
        handler: createdTaskEventHandler({ socketClient })
      },
      {
        topic: {
          key: 'MESSAGING_TOPIC_UPDATED_TASK',
          value: config.nsq.messagingTopicUpdatedTask
        },
        handler: updatedTaskEventHandler({ socketClient })
      }
    ];

    eventHandlersMapping.forEach(({ topic, handler }) => {
      logger.info(`Initializing Reader on topic '${topic.key}' with handler ${handler.getIdentifier()}`);
      messageReader.initialize({ topic, channel: config.nsq.messagingChannel, handler });
    });
  };

  return {
    initialize
  };
};
