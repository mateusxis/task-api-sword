const fs = require('fs');
const Winston = require('winston');

if (!fs.existsSync(`logs`)) {
  fs.mkdirSync(`logs`);
}

module.exports = ({ config }) => {
  const logger = new Winston.createLogger({
    transports: [
      new Winston.transports.Console(),
      new Winston.transports.File(
        Object.assign(config.logging, {
          filename: `logs/${config.nodeEnv}.log`
        })
      )
    ]
  });

  const info = (...args) => logger.info(...args);

  const debug = (...args) => logger.debug(...args);

  const warn = (...args) => logger.warn(...args);

  const error = (...args) => logger.error(...args);

  return {
    info,
    debug,
    warn,
    error
  };
};
