const validTaskFixture = require('../__fixtures__/validTask.json');

const fakeTaskRepository = {
  getAll: jest.fn(() => ([{ ...validTaskFixture }])),
  getByUserId: jest.fn(() => ([{ ...validTaskFixture }])),
  remove: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
};

module.exports = fakeTaskRepository;
