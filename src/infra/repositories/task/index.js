const taskRepository = ({ database }) => {
  const listAll = async () =>
    await database.task.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

  const listByUserId = async ({ userId }) =>
    await database.task.findMany({
      where: { userId }
    });

  const remove = async ({ id }) =>
    await database.task.delete({
      where: {
        id
      }
    });

  const save = async (task = {}) => await database.task.create({ data: task });

  const update = async (task = {}) =>
    await database.task.update({
      where: {
        id: task.id
      },
      data: task
    });

  return {
    listAll,
    listByUserId,
    remove,
    save,
    update
  };
};

module.exports = taskRepository;
