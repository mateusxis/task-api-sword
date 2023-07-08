const validUserFixture = require('./__fixtures__/validUser.json');
const authentication = require('./authentication')({
  config: {
    authentication: {
      authSecret: 'myAuthKey',
      ttl: 3700
    }
  }
});

describe('authentication', () => {
  let token;

  it('should generate a token', () => {
    token = authentication.generate(validUserFixture);
    expect(typeof token).toEqual('string');
  });

  it('should decode token properly', () => {
    const decodedToken = authentication.decode(token);

    expect(typeof token).toEqual('string');
    expect(decodedToken.id).toEqual(validUserFixture.id);
    expect(decodedToken.name).toEqual(validUserFixture.name);
    expect(decodedToken.email).toEqual(validUserFixture.email);
    expect(decodedToken.createdAt).toEqual(validUserFixture.createdAt);
    expect(decodedToken.role).toEqual(validUserFixture.role);
  });

  it('should verify the token', () => {
    const data = authentication.verify(token);

    expect(data.id).toEqual(validUserFixture.id);
    expect(data.name).toEqual(validUserFixture.name);
    expect(data.email).toEqual(validUserFixture.email);
    expect(data.createdAt).toEqual(validUserFixture.createdAt);
    expect(data.role).toEqual(validUserFixture.role);
  });
});
