const validUserFixture = require('./__fixtures__/validUser.json');

const User = require('./user');

describe('UserDomain', () => {
  it('should return data properly', () => {
    const user = new User(validUserFixture);
    const { valid } = user.validate(validUserFixture);

    expect(valid).toBeTruthy();
    expect(user.toJSON().id).toEqual(validUserFixture.id);
    expect(user.toJSON().name).toEqual(validUserFixture.name);
    expect(user.toJSON().email).toEqual(validUserFixture.email);
    expect(user.toJSON().role).toEqual(validUserFixture.role);
    expect(user.toJSON().password).toEqual(validUserFixture.password);
    expect(user.toJSON().createdAt).toEqual(new Date(validUserFixture.createdAt));
  });

  it('should return role like "DEV" then role is not provided or empty', () => {
    const notProvidedRoleFixtures = { ...validUserFixture };
    delete notProvidedRoleFixtures.role;
    const user = new User(notProvidedRoleFixtures);

    expect(user.toJSON().role).toEqual('DEV');
  });

  it('should fail with invalid email address', () => {
    const invalidEmailFixture = { ...validUserFixture, email: 'invalidEmail' };
    const user = new User(invalidEmailFixture);
    const { valid, errors } = user.validate(invalidEmailFixture);

    expect(valid).toBeFalsy();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors[0].message).toEqual('"email" must be a valid email');
  });

  it('should fail when all fields are not provided or empty', () => {
    const user = new User({});
    const { valid, errors } = user.validate({});

    expect(valid).toBeFalsy();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(3);
    expect(errors[0].message).toEqual('"name" is required');
    expect(errors[1].message).toEqual('"email" is required');
    expect(errors[2].message).toEqual('"password" is required');
  });
});
