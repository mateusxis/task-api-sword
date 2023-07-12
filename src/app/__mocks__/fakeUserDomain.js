const validUserFixture = require('../__fixtures__/validUser.json');

const fakeUserDomain = {
  getById: jest.fn(() => ({ ...validUserFixture })),
  save: jest.fn(() => ({ ...validUserFixture }))
};

module.exports = fakeUserDomain;
