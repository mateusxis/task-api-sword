const userServiceFactory = require('./user');

const validUserFixture = require('../__fixtures__/validUser.json');
const fakeUserDomain = require('../__mocks__/fakeUserDomain');

describe('UserDomain', () => {
  describe('getById()', () => {
    const userService = userServiceFactory({
      userDomain: fakeUserDomain
    });
    it('should return data properly', async () => {
      const validUser = {
        email: validUserFixture.email,
        password: 'myPassword',
        id: 2
      };
      const user = await userService.getById(validUser);

      expect(fakeUserDomain.getById).toHaveBeenCalledWith({ id: 2 });
      expect(user).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'MANAGER',
        createdAt: '2023-07-08T19:45:24.955Z'
      });
    });
  });

  describe('save()', () => {
    const userService = userServiceFactory({
      userDomain: fakeUserDomain
    });
    it('should return data properly', async () => {
      const validUser = {
        email: validUserFixture.email,
        role: validUserFixture.role,
        name: validUserFixture.name,
        password: 'myPassword'
      };
      const user = await userService.save(validUser);

      expect(fakeUserDomain.save).toHaveBeenCalledWith({ ...validUser });
      expect(user).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'MANAGER',
        createdAt: '2023-07-08T19:45:24.955Z'
      });
    });
  });
});
