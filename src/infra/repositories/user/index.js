const userRepository = ({ database }) => {
  const getById = async ({ id }) =>
    await database.user.findUnique({
      where: { id }
    });

  const getByEmail = async ({ email }) =>
    await database.user.findUnique({
      where: { email }
    });

  const save = async (user = {}) => await database.user.create({ data: user });

  return {
    getById,
    getByEmail,
    save
  };
};

module.exports = userRepository;
