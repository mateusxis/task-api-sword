const taskDomainFactory = require('./task');

const fakeLogger = require('../__mocks__/fakeLogger');
const fakeTaskRepository = require('../__mocks__/fakeTaskRepository');
const validTaskFixture = require('../__fixtures__/validTask.json');
const largerSummaryTaskFixture = require('../__fixtures__/largerSummaryTask.json');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskDomain', () => {
  describe('validate()', () => {
    const taskDomain = taskDomainFactory({
      logger: fakeLogger,
      taskRepository: fakeTaskRepository
    });

    it('should return data properly', () => {
      const { valid, data } = taskDomain.validate(validTaskFixture);

      expect(valid).toBeTruthy();
      expect(data.id).toEqual(validTaskFixture.id);
      expect(data.summary).toEqual(validTaskFixture.summary);
      expect(data.userId).toEqual(validTaskFixture.userId);
      expect(data.executedAt).toEqual(new Date(validTaskFixture.executedAt));
      expect(data.createdAt).toEqual(new Date(validTaskFixture.createdAt));
    });

    it('should fail with invalid email address', () => {
      const { valid, errors } = taskDomain.validate(largerSummaryTaskFixture);

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors[0].message).toEqual('"summary" length must be less than or equal to 2500 characters long');
    });

    it('should fail when all fields are not provided or empty', () => {
      const { valid, errors } = taskDomain.validate({});

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors[0].message).toEqual('"userId" is required');
    });
  });

  describe('get()', () => {
    const taskDomain = taskDomainFactory({
      logger: fakeLogger,
      taskRepository: fakeTaskRepository
    });

    it('should call getAll then role user is MANAGER', async () => {
      const validUserFixture = {
        userId: 1,
        role: 'MANAGER'
      };
      const auth = await taskDomain.get(validUserFixture);

      expect(Array.isArray(auth)).toBeTruthy();
      expect(fakeTaskRepository.getAll).toHaveBeenCalledWith({ userId: validUserFixture.userId });
    });

    it('should call getAll then role user is DEV', async () => {
      const validUserFixture = {
        userId: 2,
        role: 'DEV'
      };
      const auth = await taskDomain.get(validUserFixture);

      expect(Array.isArray(auth)).toBeTruthy();
      expect(fakeTaskRepository.getByUserId).toHaveBeenCalledWith({ userId: validUserFixture.userId });
    });

    it('should call getAll then role user is invalid', async () => {
      const validUserFixture = {
        userId: 3,
        role: 'NONE'
      };

      await expect(taskDomain.get(validUserFixture)).rejects.toThrowError('Your role NONE does not exist');
      expect(fakeTaskRepository.getByUserId).not.toHaveBeenCalled();
      expect(fakeTaskRepository.getByUserId).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    const taskDomain = taskDomainFactory({
      logger: fakeLogger,
      taskRepository: fakeTaskRepository
    });

    it('should call remove then role user is MANAGER', async () => {
      await taskDomain.remove({
        id: 1,
        role: 'MANAGER'
      });

      expect(fakeTaskRepository.remove).toHaveBeenCalledWith({ id: 1 });
    });

    it('should not call remove then role user is invalid', async () => {
      await expect(taskDomain.remove({ id: 1, role: 'DEV' })).rejects.toThrowError(
        `You don't have permission to delete task 1`
      );
      expect(fakeTaskRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('save()', () => {
    const taskDomain = taskDomainFactory({
      logger: fakeLogger,
      taskRepository: fakeTaskRepository
    });

    it('should call repository with task to save', async () => {
      await taskDomain.save({
        userId: validTaskFixture.userId,
        summary: validTaskFixture.summary
      });

      expect(fakeTaskRepository.save).toHaveBeenCalledWith({
        userId: validTaskFixture.userId,
        summary: validTaskFixture.summary
      });
    });

    it('should not call repository then userId is undefined', async () => {
      await expect(taskDomain.save({ summary: validTaskFixture.summary })).rejects.toThrowError(
        `There are one or more invalid fields`
      );
      expect(fakeTaskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    const taskDomain = taskDomainFactory({
      logger: fakeLogger,
      taskRepository: fakeTaskRepository
    });

    it('should call repository with task to update', async () => {
      const { summary, executedAt, userId, id } = validTaskFixture;

      await taskDomain.update({
        summary,
        executedAt,
        userId,
        id
      });

      expect(fakeTaskRepository.update).toHaveBeenCalledWith({
        summary,
        executedAt: new Date(executedAt),
        userId,
        id
      });
    });

    it('should not call repository then userId is undefined', async () => {
      const { summary, executedAt, id } = validTaskFixture;

      await expect(taskDomain.update({ summary, executedAt, id })).rejects.toThrowError(
        `There are one or more invalid fields`
      );
      expect(fakeTaskRepository.update).not.toHaveBeenCalled();
    });
  });
});
