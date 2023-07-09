const userController = ({ userService }) => {
  const get = async (ctx) => {
    const { id } = ctx.state.user;
    const user = await userService.getById({ id });
    ctx.body = user;
    ctx.status = 200;
  };

  const save = async (ctx) => {
    const { name, email, password, role } = ctx.request.body;
    const user = await userService.save({ name, email, password, role });

    ctx.body = user;
  };

  return {
    get,
    save
  };
};

module.exports = userController;
