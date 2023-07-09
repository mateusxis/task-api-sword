const userDomainFactory = require('./user');

const validUserFixture = require('../__fixtures__/validUser.json');
const fakeEncryption = require('../__mocks__/fakeEncryption');
const fakeLogger = require('../__mocks__/fakeLogger');
const fakeUserRepository = require('../__mocks__/fakeUserRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserDomain', () => {
  describe('validate()', () => {
    const userDomain = userDomainFactory({
      logger: fakeLogger,
      encryption: fakeEncryption,
      userRepository: fakeUserRepository
    });

    it('should return data properly', () => {
      const { data, valid } = userDomain.validate({ ...validUserFixture });

      expect(valid).toBeTruthy();
      expect(data.id).toEqual(validUserFixture.id);
      expect(data.name).toEqual(validUserFixture.name);
      expect(data.email).toEqual(validUserFixture.email);
      expect(data.role).toEqual(validUserFixture.role);
      expect(data.password).toEqual(validUserFixture.password);
      expect(data.createdAt).toEqual(new Date(validUserFixture.createdAt));
    });

    it('should return role like "DEV" then role is not provided or empty', () => {
      const notProvidedRoleFixtures = { ...validUserFixture };
      delete notProvidedRoleFixtures.role;
      const { data, valid } = userDomain.validate(notProvidedRoleFixtures);

      expect(valid).toBeTruthy();
      expect(data.role).toEqual('DEV');
    });

    it('should fail with invalid email address', () => {
      const invalidEmailFixture = { ...validUserFixture, email: 'invalidEmail' };
      const { valid, errors } = userDomain.validate(invalidEmailFixture);

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors[0].message).toEqual('"email" must be a valid email');
    });

    it('should fail when all fields are not provided or empty', () => {
      const { valid, errors } = userDomain.validate({});

      expect(valid).toBeFalsy();
      expect(Array.isArray(errors)).toBeTruthy();
      expect(errors).toHaveLength(3);
      expect(errors[0].message).toEqual('"name" is required');
      expect(errors[1].message).toEqual('"email" is required');
      expect(errors[2].message).toEqual('"password" is required');
    });
  });

  describe('getById()', () => {
    const userDomain = userDomainFactory({
      encryption: fakeEncryption,
      logger: fakeLogger,
      userRepository: fakeUserRepository
    });
    it('should return data properly', async () => {
      const user = await userDomain.getById({ id: 1 });

      expect(user).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'MANAGER',
        createdAt: '2023-07-08T19:45:24.955Z'
      });
      expect(fakeUserRepository.getById).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('save()', () => {
    const userDomain = userDomainFactory({
      encryption: fakeEncryption,
      logger: fakeLogger,
      userRepository: fakeUserRepository
    });
    it('should return data properly', async () => {
      await userDomain.save({ ...validUserFixture, email: 'foo@bar.com' });

      expect(fakeEncryption.encryptPassword).toHaveBeenCalledWith(validUserFixture.password);
      expect(fakeUserRepository.save).toHaveBeenCalledWith({
        name: validUserFixture.name,
        email: 'foo@bar.com',
        password: validUserFixture.password,
        role: validUserFixture.role
      });
    });

    it('should not call repository then email is existed', async () => {
      await expect(userDomain.save({ ...validUserFixture })).rejects.toThrowError(
        `existed user`
      );
      expect(fakeUserRepository.save).not.toHaveBeenCalled();
    });

    it('should not call repository then email is undefined', async () => {
      await expect(userDomain.save({ name: validUserFixture.name, password: validUserFixture.password })).rejects.toThrowError(
        `there are one or more invalid fields`
      );
      expect(fakeUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
