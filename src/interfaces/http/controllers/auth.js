const authController = ({ authService }) => {
  const login = async (ctx) => {
    const { email, password } = ctx.request.body;
    const user = await authService.login({ email, password });

    ctx.body = user;
  };

  return {
    login
  };
};

module.exports = authController;
