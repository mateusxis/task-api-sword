const taskRepository = ({ database }) => {
  const getAll = async () =>
    await database.task.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

  const getByUserId = async ({ userId }) =>
    await database.task.findMany({
      where: { userId }
    });

  const remove = async ({ id }) =>
    await database.task.delete({
      where: {
        id
      }
    });

  const save = async (task = {}) => await database.task.save(task);

  const update = async (task = {}) =>
    await database.task.update({
      where: {
        id: task.id
      },
      data: task
    });

  return {
    getAll,
    getByUserId,
    remove,
    save,
    update
  };
};

module.exports = taskRepository;