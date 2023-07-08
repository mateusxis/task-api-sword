const { comparePassword, encryptPassword } = require('./encryption')();

describe('encryption()', () => {
  it('should return true when the password is equal to the encoded password', () => {
    const currencyPassword = 'MyP@s$W0rd';
    const encodedPassword = encryptPassword(currencyPassword);

    expect(comparePassword(currencyPassword, encodedPassword)).toBeTruthy();
  });
  it('should return false when the password is not equal to the encoded passwords', () => {
    const currencyPassword = 'MyP@s$W0rd';
    const otherPassword = '0th&rP@s$W0rd';
    const encodedPassword = encryptPassword(currencyPassword);

    expect(comparePassword(otherPassword, encodedPassword)).toBeFalsy();
  });
});
