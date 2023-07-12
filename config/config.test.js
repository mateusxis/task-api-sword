const config = require('./config');

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

beforeEach(() => {
  process.env.NODE_ENV = 'development';
  process.env.AUTH_SECRET = 'myAuthKey';
  process.env.AUTH_TTL = '3700';
  process.env.BASE_URL = 'http://localhost';
  process.env.DATABASE_URL = 'mysql://myuser:mypassword@localhost:3306/mydb';
  process.env.LOGGING_COLORIZE = '0';
  process.env.LOGGING_MAX_FILES = '2';
  process.env.LOGGING_MAX_SIZE = '102400';
  process.env.NSQ_SERVER_ADDRESS = 'http://localhost';
  process.env.NSQ_SERVER_PORT = 4150;
  process.env.NSQ_READER_ADDRESS = 'localhost:4161';
  process.env.NSQ_TOPIC_CREATED_TASK = 'MESSAGING_TOPIC_CREATED_TASK';
  process.env.NSQ_TOPIC_UPDATED_TASK = 'MESSAGING_TOPIC_UPDATED_TASK';
  process.env.NSQ_MESSAGING_CHANNEL = 'task-api';
  process.env.SOCKET_SERVER_ADDRESS = 'localhost';
  process.env.SOCKET_SERVER_PORT = 3333;
  process.env.SERVER_PORT = 3000;

  jest.resetAllMocks();
});

describe('config()', () => {
  it('should call config return variables', () => {
    expect(config()).toEqual({
      authentication: {
        authSecret: 'myAuthKey',
        ttl: 3700
      },
      baseUrl: 'http://localhost',
      databaseUrl: 'mysql://myuser:mypassword@localhost:3306/mydb',
      logging: {
        colorize: false,
        maxFiles: 2,
        maxsize: 102400
      },
      nsq: {
        serverAddress: 'http://localhost',
        serverPort: 4150,
        readerAddress: 'localhost:4161',
        messagingTopicCreatedTask: 'MESSAGING_TOPIC_CREATED_TASK',
        messagingTopicUpdatedTask: 'MESSAGING_TOPIC_UPDATED_TASK',
        messagingChannel: 'task-api',
        maxInFlight: 1,
        messageTimeout: 60000
      },
      socket: {
        serverAddress: 'localhost',
        port: 3333
      },
      nodeEnv: 'development',
      serverPort: 3000
    });
  });

  it('should set node env like "production"', () => {
    process.env.NODE_ENV = 'production';

    expect(config().nodeEnv).toEqual('production');
  });

  it('should throw error when base url variable is missing', () => {
    delete process.env.BASE_URL;

    expect(() => config()).toThrowError('"BASE_URL" must be defined.');
  });

  it('should throw error when database url variable is missing', () => {
    delete process.env.DATABASE_URL;

    expect(() => config()).toThrowError('"DATABASE_URL" must be defined.');
  });

  it('should throw error when server port variable is missing', () => {
    delete process.env.SERVER_PORT;

    expect(() => config()).toThrowError('"SERVER_PORT" must be defined.');
  });

  it('should return "development" node env variable is missing', () => {
    delete process.env.NODE_ENV;

    expect(config().nodeEnv).toEqual('development');
  });

  describe('authentication', () => {
    it('should return 3600 when ttl variable is missing', () => {
      delete process.env.AUTH_TTL;

      expect(config().authentication.ttl).toEqual(3600);
    });

    it('should throw error when auth key variable is missing', () => {
      delete process.env.AUTH_SECRET;

      expect(() => config()).toThrowError('"AUTH_SECRET" must be defined.');
    });
  });

  describe('logging', () => {
    it('should return true when colorize variable is "1"', () => {
      process.env.LOGGING_COLORIZE = '1';

      expect(config().logging.colorize).toEqual(true);
    });

    it('should return false when colorize variable is missing', () => {
      delete process.env.LOGGING_COLORIZE;

      expect(config().logging.colorize).toEqual(false);
    });

    it('should throw error when max files variable is missing', () => {
      delete process.env.LOGGING_MAX_FILES;

      expect(() => config()).toThrowError('"LOGGING_MAX_FILES" must be defined.');
    });

    it('should throw error when max size variable is missing', () => {
      delete process.env.LOGGING_MAX_SIZE;

      expect(() => config()).toThrowError('"LOGGING_MAX_SIZE" must be defined.');
    });
  });

  describe('nsq', () => {
    it('should throw error when server address variable is missing', () => {
      delete process.env.NSQ_SERVER_ADDRESS;

      expect(() => config()).toThrowError('"NSQ_SERVER_ADDRESS" must be defined.');
    });

    it('should throw error when server port variable is missing', () => {
      delete process.env.NSQ_SERVER_PORT;

      expect(() => config()).toThrowError('"NSQ_SERVER_PORT" must be defined.');
    });

    it('should throw error when topic created task variable is missing', () => {
      delete process.env.NSQ_TOPIC_CREATED_TASK;

      expect(() => config()).toThrowError('"NSQ_TOPIC_CREATED_TASK" must be defined.');
    });

    it('should throw error when topic updated task variable is missing', () => {
      delete process.env.NSQ_TOPIC_UPDATED_TASK;

      expect(() => config()).toThrowError('"NSQ_TOPIC_UPDATED_TASK" must be defined.');
    });

    it('should throw error when messaging channel variable is missing', () => {
      delete process.env.NSQ_MESSAGING_CHANNEL;

      expect(() => config()).toThrowError('"NSQ_MESSAGING_CHANNEL" must be defined.');
    });
  });

  describe('socket', () => {
    it('should throw error when server address variable is missing', () => {
      delete process.env.SOCKET_SERVER_ADDRESS;

      expect(() => config()).toThrowError('"SOCKET_SERVER_ADDRESS" must be defined.');
    });

    it('should throw error when serve port variable is missing', () => {
      delete process.env.SOCKET_SERVER_PORT;

      expect(() => config()).toThrowError('"SOCKET_SERVER_PORT" must be defined.');
    });
  });
});
