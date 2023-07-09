const userService = ({ userDomain }) => {
  const getById = async ({ id }) => {
    const user = await userDomain.getById({ id });

    return user;
  };

  const save = async ({ name, email, password, role }) => {
    const user = await userDomain.save({ name, email, password, role });

    return user;
  };

  return {
    getById,
    save
  };
};

module.exports = userService;
