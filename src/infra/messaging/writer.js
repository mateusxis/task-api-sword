const nsq = require('nsqjs');
const inspect = require('util');

const messageWriter = ({ logger, config }) => {
  const writer = new nsq.Writer(config?.nsq.serverAddress, config?.nsq.serverPort, { logger });
  let retries = 1;

  if (!writer.connected) {
    writer.connect();
  }

  writer.on('ready', () => {
    logger.debug('NSQ writer connection is ready');
    retries = 1;
  });
  writer.on('error', (error) => {
    logger.error('NSQ writer connection had an error', {
      error: inspect.inspect(error)
    });
  });
  writer.on('closed', () => {
    logger.warn(`Lost connection with NSQ. Reconnecting (retry #${retries})`);

    setTimeout(() => {
      writer.connect();

      retries += 1;
    }, 1000 * retries);
  });

  const send = async (topic, message) =>
    new Promise((resolve) => {
      logger.info(`Sending message to topic '${topic}'`, message);
      writer.publish(topic, message, (error) => {
        if (error) {
          logger.error(error);

          setTimeout(() => {
            send(topic, message);
          }, 5000);
        } else {
          resolve();
        }
      });
    });

  return { send };
};

module.exports = messageWriter;
