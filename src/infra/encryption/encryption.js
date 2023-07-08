const bcrypt = require('bcrypt');

module.exports = () => {
  const comparePassword = (password, encodedPassword) => {
    return bcrypt.compareSync(password, encodedPassword);
  };

  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  };

  return {
    encryptPassword,
    comparePassword
  };
};
