const authService = ({ authDomain }) => {
  const login = async ({ email, password }) => {
    const { user, token } = await authDomain.login({ email, password });

    return { user, token };
  };

  return {
    login
  };
};

module.exports = authService;
