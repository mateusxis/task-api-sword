const validTaskFixture = require('../__fixtures__/validTask.json');

const fakeTaskRepository = {
  listAll: jest.fn(() => [{ ...validTaskFixture }]),
  listByUserId: jest.fn(() => [{ ...validTaskFixture }]),
  remove: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

module.exports = fakeTaskRepository;
