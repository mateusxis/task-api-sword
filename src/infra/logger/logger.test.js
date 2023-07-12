const logger = require('./logger');
const Winston = require('winston');

jest.mock('winston');

const config = {
  logging: {
    colorize: false,
    maxFiles: 2,
    maxsize: 102400
  },
  nodeEnv: 'development'
};

let winstonFunctions;

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    winstonFunctions = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    Winston.transports = { Console: jest.fn(), File: jest.fn() };
    Winston.createLogger.mockImplementationOnce(() => winstonFunctions);
  });
  it('should call info', () => {
    const spyFinishWinston = jest.spyOn(winstonFunctions, 'info');
    const loggerInstance = logger({
      config
    });

    loggerInstance.info('info user', { data: { email: 'foo@bar.com' } });

    expect(spyFinishWinston).toHaveBeenCalled();
  });

  it('should call debug', () => {
    const spyFinishWinston = jest.spyOn(winstonFunctions, 'debug');
    const loggerInstance = logger({
      config
    });

    loggerInstance.debug('debug user', { data: { email: 'foo@bar.com' } });

    expect(spyFinishWinston).toHaveBeenCalled();
  });

  it('should call warn', () => {
    const spyFinishWinston = jest.spyOn(winstonFunctions, 'warn');
    const loggerInstance = logger({
      config
    });

    loggerInstance.warn('warn user', { data: { email: 'foo@bar.com' } });

    expect(spyFinishWinston).toHaveBeenCalled();
  });

  it('should call error', () => {
    const spyFinishWinston = jest.spyOn(winstonFunctions, 'error');
    const loggerInstance = logger({
      config
    });

    loggerInstance.error('error user', { data: { email: 'foo@bar.com' } });

    expect(spyFinishWinston).toHaveBeenCalled();
  });
});
