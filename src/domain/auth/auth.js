const { attributes } = require('structure');

const authDomain = ({ authentication, encryption, logger, userRepository }) => {
  const Auth = attributes({
    email: {
      type: String,
      required: true,
      email: true
    },
    password: {
      type: String,
      required: true
    }
  })(class Auth {});

  const getIdentifier = (origin) => `AuthDomain ${origin}`;

  const validate = ({ email, password }) => {
    const auth = new Auth({ email, password });
    const { valid, errors } = auth.validate({ email, password });

    return { valid, errors, data: auth.toJSON() };
  };

  const login = async ({ email, password }) => {
    const { valid, errors, data } = validate({ email, password });
    if (!valid) {
      const error = new Error('invalid email or password');
      error.errors = errors;
      logger.error(error.message, { identifier: getIdentifier('login'), errors });
      throw error;
    }

    const user = await userRepository.getByEmail({ email: data.email });

    if (!user) {
      const error = new Error('user not found');
      logger.error(error.message, { identifier: getIdentifier('login') });
      throw error;
    }

    const { password: encryptedPassword } = user;
    delete user.password;

    if (!encryption.comparePassword(data.password, encryptedPassword)) {
      const error = new Error('invalid credentials');
      logger.error(error.message, { identifier: getIdentifier('login') });
      throw error;
    }

    const token = authentication.generate(user);

    return { user, token };
  };

  return {
    login,
    validate
  };
};

module.exports = authDomain;
