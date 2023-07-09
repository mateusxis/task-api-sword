const { attributes } = require('structure');

const userDomain = ({ encryption, logger, userRepository }) => {
  const User = attributes({
    id: Number,
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      email: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      equal: ['DEV', 'MANAGER'],
      default: 'DEV'
    },
    createdAt: Date
  })(class User {});

  const validate = ({ id, name, password, email, role, createdAt }) => {
    const user = new User({ id, name, password, email, role, createdAt });
    const { valid, errors } = user.validate({ id, name, password, email, role, createdAt });

    return { valid, errors, data: user.toJSON() };
  };

  const getById = async ({ id }) => {
    const user = await userRepository.getById({ id });
    delete user.password;

    return user;
  };

  const save = async ({ name, email, password, role }) => {
    const { valid, errors, data } = validate({ name, email, password, role });
    if (!valid) {
      logger.error(errors);
      const error = new Error('there are one or more invalid fields');
      error.errors = errors;
      throw error;
    }

    const existedUser = await userRepository.getByEmail({ email: data.email });

    if (existedUser) {
      const error = new Error('existed user');
      logger.error({ message: error.message });
      throw error;
    }

    const encryptedPassword = encryption.encryptPassword(password);
    const user = await userRepository.save({
      name: data.name,
      email: data.email,
      password: encryptedPassword,
      role: data.role
    });
    delete user.password;

    return user;
  };

  return {
    getById,
    save,
    validate
  };
};

module.exports = userDomain;
