const morgan = require('koa-morgan');

module.exports = (logger) => {
  return morgan('common', {
    stream: {
      write: (message) => {
        logger.info(message);
      }
    }
  });
};
