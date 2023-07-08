require('dotenv').config();

module.exports = () => {
  const getNodeEnv = () => {
    return process.env.NODE_ENV || 'development';
  };

  const getBaseUrl = () => {
    if (!process.env.BASE_URL) {
      throw new Error('"BASE_URL" must be defined.');
    }

    return process.env.BASE_URL;
  };

  const getLogging = () => {
    if (!process.env.LOGGING_MAX_FILES) {
      throw new Error('"LOGGING_MAX_FILES" must be defined.');
    }

    if (!process.env.LOGGING_MAX_SIZE) {
      throw new Error('"LOGGING_MAX_SIZE" must be defined.');
    }

    return {
      colorize: Boolean(parseInt(process.env.LOGGING_COLORIZE, 10)),
      maxFiles: parseInt(process.env.LOGGING_MAX_FILES, 10),
      maxsize: parseInt(process.env.LOGGING_MAX_SIZE, 10)
    };
  };

  const getServerPort = () => {
    if (!process.env.SERVER_PORT) {
      throw new Error('"SERVER_PORT" must be defined.');
    }

    return parseInt(process.env.SERVER_PORT, 10);
  };

  return {
    baseUrl: getBaseUrl(),
    nodeEnv: getNodeEnv(),
    serverPort: getServerPort(),
    logging: getLogging()
  };
};
