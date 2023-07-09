const validUserFixture = require('../__fixtures__/validUser.json');

const fakeUserRepository = {
  getByEmail: jest.fn(({ email }) => email === validUserFixture.email && validUserFixture),
  getById: jest.fn(() => ({ ...validUserFixture })),
  save: jest.fn(() => ({ ...validUserFixture }))
};

module.exports = fakeUserRepository;
