const taskServiceFactory = require('./task');

const validTaskFixture = require('../__fixtures__/validTask.json');
const fakeMessageWriter = require('../__mocks__/fakeMessageWriter');
const fakeTaskDomain = require('../__mocks__/fakeTaskDomain');

const fakeConfig = {
  nsq: {
    serverAddress: 'http://localhost',
    serverPort: 4150,
    readerAddress: 'localhost:4161',
    messagingTopicCreatedTask: 'MESSAGING_TOPIC_CREATED_TASK',
    messagingTopicUpdatedTask: 'MESSAGING_TOPIC_UPDATED_TASK',
    messagingChannel: 'task-api',
    maxInFlight: 1,
    messageTimeout: 60000
  }
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskDomain', () => {
  describe('list()', () => {
    const taskService = taskServiceFactory({
      taskDomain: fakeTaskDomain
    });
    it('should return data properly', async () => {
      const validUserFixture = {
        userId: 1,
        role: 'MANAGER'
      };
      const task = await taskService.list({ user: validUserFixture });

      expect(fakeTaskDomain.list).toHaveBeenCalledWith({ id: validUserFixture.id, role: validUserFixture.role });
      expect(task).toEqual([validTaskFixture]);
    });
  });
  describe('remove()', () => {
    const taskService = taskServiceFactory({
      taskDomain: fakeTaskDomain
    });
    it('should call remove domain', async () => {
      const validUserFixture = {
        userId: 1,
        role: 'MANAGER'
      };
      await taskService.remove({ user: validUserFixture, id: 1 });

      expect(fakeTaskDomain.remove).toHaveBeenCalledWith({ id: 1, role: validUserFixture.role });
    });
  });
  describe('save()', () => {
    const taskService = taskServiceFactory({
      taskDomain: fakeTaskDomain,
      messageWriter: fakeMessageWriter,
      config: fakeConfig
    });
    it('should call messageWriter.send then there is executedAt', async () => {
      const validUserFixture = {
        id: 1,
        role: 'DEV',
        name: 'Tre'
      };
      const task = await taskService.save({
        user: validUserFixture,
        task: {
          ...validTaskFixture,
          executedAt: '2023-07-10 10:53:58.881'
        }
      });

      const expectedTask = {
        ...validTaskFixture,
        executedAt: '2023-07-10 10:53:58.881',
        id: 2
      };

      expect(fakeTaskDomain.save).toHaveBeenCalledWith({
        ...validTaskFixture,
        executedAt: '2023-07-10 10:53:58.881',
        userId: validUserFixture.id,
        role: validUserFixture.role
      });
      expect(fakeMessageWriter.send).toHaveBeenCalledWith(fakeConfig.nsq.messagingTopicCreatedTask, {
        task: expectedTask,
        user: { id: validUserFixture.id, name: validUserFixture.name, role: validUserFixture.role }
      });
      expect(task).toEqual(expectedTask);
    });
    it('should not call messageWriter.send then there is not executedAt', async () => {
      const validUserFixture = {
        id: 1,
        role: 'DEV',
        name: 'Tre'
      };
      const task = await taskService.save({
        user: validUserFixture,
        task: validTaskFixture
      });

      const expectedTask = {
        ...validTaskFixture,
        id: 2
      };

      expect(fakeTaskDomain.save).toHaveBeenCalledWith({
        ...validTaskFixture,
        userId: validUserFixture.id,
        role: validUserFixture.role
      });
      expect(fakeMessageWriter.send).not.toHaveBeenCalled();
      expect(task).toEqual(expectedTask);
    });
  });

  describe('update()', () => {
    const taskService = taskServiceFactory({
      taskDomain: fakeTaskDomain,
      messageWriter: fakeMessageWriter,
      config: fakeConfig
    });
    it('should call messageWriter.send then there is executedAt', async () => {
      const validUserFixture = {
        id: 1,
        role: 'DEV',
        name: 'Tre'
      };
      const task = await taskService.update({
        user: validUserFixture,
        task: {
          ...validTaskFixture,
          executedAt: '2023-07-10 10:53:58.881',
          id: 2
        }
      });

      const expectedTask = {
        ...validTaskFixture,
        executedAt: '2023-07-10 10:53:58.881',
        id: 2
      };

      expect(fakeTaskDomain.update).toHaveBeenCalledWith({
        ...validTaskFixture,
        id: 2,
        executedAt: '2023-07-10 10:53:58.881',
        userId: validUserFixture.id,
        role: validUserFixture.role
      });
      expect(fakeMessageWriter.send).toHaveBeenCalledWith(fakeConfig.nsq.messagingTopicUpdatedTask, {
        task: expectedTask,
        user: { id: validUserFixture.id, name: validUserFixture.name, role: validUserFixture.role }
      });
      expect(task).toEqual(expectedTask);
    });
    it('should not call messageWriter.send then there is not executedAt', async () => {
      const validUserFixture = {
        id: 1,
        role: 'DEV',
        name: 'Tre'
      };
      const task = await taskService.update({
        user: validUserFixture,
        task: { ...validTaskFixture, id: 2 }
      });

      const expectedTask = {
        ...validTaskFixture,
        id: 2
      };

      expect(fakeTaskDomain.update).toHaveBeenCalledWith({
        ...validTaskFixture,
        id: 2,
        userId: validUserFixture.id,
        role: validUserFixture.role
      });
      expect(fakeMessageWriter.send).not.toHaveBeenCalled();
      expect(task).toEqual(expectedTask);
    });
  });
});
