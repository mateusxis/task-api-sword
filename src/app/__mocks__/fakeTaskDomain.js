const validTaskFixture = require('../__fixtures__/validTask.json');

const fakeTaskRepository = {
  list: jest.fn(() => [{ ...validTaskFixture }]),
  listByUserId: jest.fn(() => [{ ...validTaskFixture }]),
  remove: jest.fn(),
  save: jest.fn(({ executedAt }) => ({ ...validTaskFixture, executedAt, id: 2 })),
  update: jest.fn(({ executedAt }) => ({ ...validTaskFixture, executedAt, id: 2 }))
};

module.exports = fakeTaskRepository;
