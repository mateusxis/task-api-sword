const nsq = require('nsqjs');

const messageReader = ({ logger, config }) => {
  let reader;
  let connected = false;
  const topics = [];

  const isConnected = () => connected;

  const initialize = ({ topic, channel, handler }) => {
    if (!topic.value) {
      logger.error(`Missing topic: ${topic.key}.`, {
        topic
      });
      return;
    }

    const lookupdPollInterval = 10;
    const options = {
      maxInFlight: config.nsq.maxInFlight,
      messageTimeout: config.nsq.messageTimeout,
      lookupdPollInterval,
      lookupdHTTPAddresses: config.nsq.readerAddress,
      logger,
      requeueDelay: 30000
    };

    reader = new nsq.Reader(topic.value, channel, options);

    if (!topics.includes(`t${topic.value}-c${channel}`)) {
      reader.connect();
      topics.push(`t${topic.value}-c${channel}`);
    }

    reader.on('nsqd_connected', () => {
      connected = true;
    });

    reader.on('message', async (message) => {
      let messageContent;

      try {
        messageContent = message.json();
      } catch (e) {
        logger.warn('Message is not a valid json', {
          messageId: message.id
        });
        message.finish();
        return;
      }

      try {
        const touch = () => {
          if (!message.hasResponded) {
            message.touch();
            setTimeout(touch, message.timeUntilTimeout() - 1000);
          }
        };

        const timeout = setTimeout(touch, message.timeUntilTimeout() - 1000);

        await handler.handle(messageContent);

        if (timeout) {
          clearTimeout(timeout);
        }

        message.finish();
      } catch (error) {
        message.requeue(5);
        logger.error(`Error processing message from "${topic.value}/${channel}"`, {
          messageId: message.id,
          error
        });
      }
    });

    reader.on('error', (error) => {
      logger.error(`Error receiving message from "${topic.value}/${channel}"`, {
        error
      });
    });

    reader.on('discard', (message) => {
      logger.warn('Message discarded after attempts.', { messageId: message.id });
    });

    reader.on('nsqd_closed', () => {
      connected = false;
      setTimeout(() => {
        initialize({ topic, channel, handler });
      }, 100);
    });

    logger.debug(`Successfully registered a handler for events under '${topic.value}/${channel}'`);
  };

  return {
    isConnected,
    initialize
  };
};

module.exports = messageReader;
