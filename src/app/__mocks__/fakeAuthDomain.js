const validUserFixture = require('../__fixtures__/validUser.json');

const fakeAuthDomain = {
  login: jest.fn(() => ({
    user: validUserFixture,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG'
  }))
};

module.exports = fakeAuthDomain;
