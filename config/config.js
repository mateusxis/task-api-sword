const assert = require('assert');
require('dotenv').config();

module.exports = () => {
  const getNodeEnv = () => {
    return process.env.NODE_ENV || 'development';
  };

  const getAuthentication = () => {
    assert(process.env.AUTH_SECRET, '"AUTH_SECRET" must be defined.');

    return {
      authSecret: process.env.AUTH_SECRET,
      ttl: parseInt(process.env.AUTH_TTL, 10) || 3600
    };
  };

  const getBaseUrl = () => {
    assert(process.env.BASE_URL, '"BASE_URL" must be defined.');

    return process.env.BASE_URL;
  };

  const getDatabaseUrl = () => {
    assert(process.env.DATABASE_URL, '"DATABASE_URL" must be defined.');

    return process.env.DATABASE_URL;
  };

  const getLogging = () => {
    assert(process.env.LOGGING_MAX_FILES, '"LOGGING_MAX_FILES" must be defined.');
    assert(process.env.LOGGING_MAX_SIZE, '"LOGGING_MAX_SIZE" must be defined.');

    return {
      colorize: Boolean(parseInt(process.env.LOGGING_COLORIZE, 10)),
      maxFiles: parseInt(process.env.LOGGING_MAX_FILES, 10),
      maxsize: parseInt(process.env.LOGGING_MAX_SIZE, 10)
    };
  };

  const getNSQ = () => {
    assert(process.env.NSQ_SERVER_ADDRESS, '"NSQ_SERVER_ADDRESS" must be defined.');
    assert(process.env.NSQ_SERVER_PORT, '"NSQ_SERVER_PORT" must be defined.');
    assert(process.env.NSQ_READER_ADDRESS, '"NSQ_READER_ADDRESS" must be defined.');
    assert(process.env.NSQ_TOPIC_CREATED_TASK, '"NSQ_TOPIC_CREATED_TASK" must be defined.');
    assert(process.env.NSQ_TOPIC_UPDATED_TASK, '"NSQ_TOPIC_UPDATED_TASK" must be defined.');
    assert(process.env.NSQ_MESSAGING_CHANNEL, '"NSQ_MESSAGING_CHANNEL" must be defined.');

    return {
      serverAddress: process.env.NSQ_SERVER_ADDRESS,
      serverPort: parseInt(process.env.NSQ_SERVER_PORT, 10),
      readerAddress: process.env.NSQ_READER_ADDRESS,
      messagingTopicCreatedTask: process.env.NSQ_TOPIC_CREATED_TASK,
      messagingTopicUpdatedTask: process.env.NSQ_TOPIC_UPDATED_TASK,
      messagingChannel: process.env.NSQ_MESSAGING_CHANNEL,
      maxInFlight: parseInt(process.env.NSQ_PARALLEL_SIZE || 1, 10),
      messageTimeout: parseInt(process.env.NSQ_TTL_MS || 60000, 10)
    };
  };

  const getSocket = () => {
    assert(process.env.SOCKET_SERVER_ADDRESS, '"SOCKET_SERVER_ADDRESS" must be defined.');
    assert(process.env.SOCKET_SERVER_PORT, '"SOCKET_SERVER_PORT" must be defined.');

    return {
      serverAddress: process.env.SOCKET_SERVER_ADDRESS,
      port: parseInt(process.env.SOCKET_SERVER_PORT, 10)
    };
  };

  const getServerPort = () => {
    assert(process.env.SERVER_PORT, '"SERVER_PORT" must be defined.');

    return parseInt(process.env.SERVER_PORT, 10);
  };

  return {
    authentication: getAuthentication(),
    baseUrl: getBaseUrl(),
    databaseUrl: getDatabaseUrl(),
    nodeEnv: getNodeEnv(),
    serverPort: getServerPort(),
    logging: getLogging(),
    nsq: getNSQ(),
    socket: getSocket()
  };
};
