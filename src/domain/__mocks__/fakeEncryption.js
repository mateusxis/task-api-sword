const fakeEncryption = {
  comparePassword: jest.fn((password, encryptedPassword) => password === encryptedPassword),
  encryptPassword: jest.fn((password) => password)
};

module.exports = fakeEncryption;
