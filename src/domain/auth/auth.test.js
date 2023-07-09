const authDomainFactory = require('./auth');

const validUserFixture = require('../__fixtures__/validUser.json');
const fakeAuthentication = require('../__mocks__/fakeAuthentication');
const fakeEncryption = require('../__mocks__/fakeEncryption');
const fakeLogger = require('../__mocks__/fakeLogger');
const fakeUserRepository = require('../__mocks__/fakeUserRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuthDomain', () => {
  describe('validate()', () => {
    const authDomain = authDomainFactory({
      authentication: fakeAuthentication,
      encryption: fakeEncryption,
      logger: fakeLogger,
      userRepository: fakeUserRepository
    });

    it('should return data properly', () => {
      const validAuthFixture = {
        email: 'john@doe.com',
        password: '$2b$10$YaeJvodd8PIOgQ6YjqJI0.XC8DitB7xIYSUDu265efCMYZjdnfckm'
      };
      const { valid, data } = authDomain.validate(validAuthFixture);

      expect(valid).toBeTruthy();
      expect(data.email).toEqual(validAuthFixture.email);
      expect(data.password).toEqual(validAuthFixture.password);
    });

    it('should fail with invalid email address', () => {
      const invalidEmailFixture = {
        email: 'invalidEmail.com',
        password: '$2b$10$YaeJvodd8PIOgQ6YjqJI0.XC8DitB7xIYSUDu265efCMYZjdnfckm'
      };
      const { valid, errors } = authDomain.validate(invalidEmailFixture);

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors[0].message).toEqual('"email" must be a valid email');
    });

    it('should fail when all fields are not provided or empty', () => {
      const { valid, errors } = authDomain.validate({});

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toEqual('"email" is required');
      expect(errors[1].message).toEqual('"password" is required');
    });
  });

  describe('login()', () => {
    const authDomain = authDomainFactory({
      authentication: fakeAuthentication,
      encryption: fakeEncryption,
      logger: fakeLogger,
      userRepository: fakeUserRepository
    });
    it('should return data properly', async () => {
      const validAuthFixture = {
        email: validUserFixture.email,
        password: validUserFixture.password
      };
      const auth = await authDomain.login(validAuthFixture);

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
      expect(fakeUserRepository.getByEmail).toHaveBeenCalledWith({ email: validUserFixture.email });
    });

    it('should fail with invalid email address', async () => {
      const invalidEmailFixture = {
        email: 'invalidEmail.com',
        password: validUserFixture.password
      };

      await expect(authDomain.login(invalidEmailFixture)).rejects.toThrowError('Invalid email or password');
    });

    it('should fail with invalid password', async () => {
      const invalidPasswordFixture = {
        email: validUserFixture.email,
        password: 'OtherPassword'
      };

      await expect(authDomain.login(invalidPasswordFixture)).rejects.toThrowError('Invalid credentials');
      expect(fakeEncryption.comparePassword).toHaveBeenCalledWith(
        invalidPasswordFixture.password,
        validUserFixture.password
      );
      expect(fakeUserRepository.getByEmail).toHaveBeenCalledWith({ email: validUserFixture.email });
    });
  });
});
