const messageWriter = require('./writer');
const { Writer } = require('nsqjs');

jest.mock('nsqjs');

const logger = {
  debug: jest.fn(() => {}),
  warn: jest.fn(() => {}),
  info: jest.fn(() => {}),
  error: jest.fn(() => {})
};

const config = {
  nsq: {
    serverAddress: 'http://localhost',
    serverPort: 4150
  }
};
describe('writer()', () => {
  it('must connect and publish a message successfully', () => {
    const writerFunctions = {
      on: jest.fn(),
      connect: jest.fn(),
      publish: jest.fn()
    };
    const spyFinishWriter = jest.spyOn(writerFunctions, 'connect');

    Writer.mockImplementationOnce(() => writerFunctions);

    const messageWriterInstance = messageWriter({
      config,
      logger
    });

    expect(messageWriterInstance).toBeDefined();
    expect(spyFinishWriter).toHaveBeenCalledTimes(1);
    messageWriterInstance.send('foo', { field: 'a value' });

    expect(logger.info).toHaveBeenCalledWith("Sending message to topic 'foo'", { field: 'a value' });
  });

  it('should log when disconnect', () => {
    const writerFunctions = {
      on: (event, callback) => event === 'closed' && callback(),
      connect: jest.fn()
    };
    const spyFinishWriter = jest.spyOn(writerFunctions, 'connect');

    Writer.mockImplementationOnce(() => writerFunctions);

    messageWriter({ logger, config });

    jest.useFakeTimers(2000);

    expect(logger.warn).toHaveBeenCalledWith('Lost connection with NSQ. Reconnecting (retry #1)');
  });

  it('should log when error', () => {
    Writer.mockImplementationOnce(() => ({
      on: (event, callback) => event === 'error' && callback(),
      connect: jest.fn()
    }));

    messageWriter({ logger, config });

    expect(logger.error).toHaveBeenCalledWith('NSQ writer connection had an error', { error: 'undefined' });
  });

  it('should log a error and retry when send message have a error', () => {
    Writer.mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'ready') callback();
        return this;
      },
      connect: jest.fn(),
      publish: (topic, message, callback) => {
        if (callback) callback('error');
        return this;
      }
    }));

    const messageWriterInstance = messageWriter({ logger });

    const errorHandler = jest.fn();

    messageWriterInstance.send('topic', 'message', errorHandler());

    expect(errorHandler).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();

    jest.useFakeTimers(5000);

    expect(logger.info).toHaveBeenCalledTimes(2);
  });
});
