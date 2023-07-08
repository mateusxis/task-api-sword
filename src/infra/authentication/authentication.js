const jwt = require('jsonwebtoken');

module.exports = ({ config }) => {
  const decode = (token) => {
    return jwt.decode(token);
  };

  const generate = (data) => {
    return jwt.sign(data, config.authentication.authSecret, {
      expiresIn: config.authentication.ttl
    });
  };

  const verify = (token) => {
    return jwt.verify(token, config.authentication.authSecret);
  };

  return {
    decode,
    generate,
    verify
  };
};
