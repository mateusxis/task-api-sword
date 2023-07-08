const userRepository = ({ database }) => {
  const get = async ({ email }) =>
    await database.user.findUnique({
      where: { email }
    });

  const save = async (user = {}) => await database.user.save(user);

  return {
    get,
    save
  };
};

module.exports = userRepository;