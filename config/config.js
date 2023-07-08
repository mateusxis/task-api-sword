require('dotenv').config();

module.exports = () => {
  const getNodeEnv = () => {
    return process.env.NODE_ENV || 'development';
  };

  const getServerPort = () => {
    if (!process.env.SERVER_PORT) {
      throw new Error('"SERVER_PORT" must be defined.');
    }

    return parseInt(process.env.SERVER_PORT, 10);
  };

  return {
    serverPort: getServerPort(),
    nodeEnv: getNodeEnv()
  };
};
