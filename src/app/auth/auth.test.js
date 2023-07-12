const authServiceFactory = require('./auth');

const validUserFixture = require('../__fixtures__/validUser.json');
const fakeAuthDomain = require('../__mocks__/fakeAuthDomain');

describe('AuthDomain', () => {
  describe('login()', () => {
    const authService = authServiceFactory({
      authDomain: fakeAuthDomain
    });
    it('should return data properly', async () => {
      const validAuthFixture = {
        email: validUserFixture.email,
        password: 'myPassword'
      };
      const auth = await authService.login(validAuthFixture);

      expect(fakeAuthDomain.login).toHaveBeenCalledWith({
        email: validAuthFixture.email,
        password: validAuthFixture.password
      });
      expect(auth).toEqual({
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@doe.com',
          role: 'MANAGER',
          createdAt: '2023-07-08T19:45:24.955Z'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG'
      });
    });
  });
});
