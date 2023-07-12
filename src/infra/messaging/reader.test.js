const { Reader } = require('nsqjs');
const messageReader = require('./reader');

jest.mock('nsqjs');

jest.useFakeTimers();

const logger = {
  warn: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  error: jest.fn(() => {})
};

const config = {
  nsq: {
    readerAddress: 'localhost:4161',
    messagingTopicCreatedTask: 'MESSAGING_TOPIC_CREATED_TASK',
    messagingTopicUpdatedTask: 'MESSAGING_TOPIC_UPDATED_TASK',
    messagingChannel: 'task-api',
    maxInFlight: 1,
    messageTimeout: 60000
  }
};

describe('messageReader() config,', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle message', () => {
    const msg = {
      hasResponded: false,
      timeUntilTimeout: () => 2000,
      json: () => 'there was a time',
      finish: () => jest.fn(),
      requeue: () => jest.fn()
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'message') callback(msg);
        return this;
      },
      connect: jest.fn()
    }));

    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });
    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'once upon a time'
      },
      channel: 'never end story',
      handler: messageHandler
    });

    expect(messageHandler.handle).toHaveBeenCalledWith('there was a time');
  });

  it('should finish the message if its not valid a json', () => {
    const msg = {
      id: 1234,
      requeue: () => jest.fn(),
      finish: () => jest.fn()
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'message') callback(msg);
        return this;
      },
      connect: jest.fn()
    }));

    const messageHandler = {
      handle: jest.fn()
    };

    const spyFinish = jest.spyOn(msg, 'finish');

    const messageReaderInstance = messageReader({ config, logger });
    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'once upon a time'
      },
      channel: 'never end story',
      handler: messageHandler
    });

    expect(logger.warn).toHaveBeenCalledWith('Message is not a valid json', { messageId: 1234 });
    expect(spyFinish).toHaveBeenCalled();
  });

  it('should log on error', () => {
    const error = {
      message: 'ops'
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => event === 'error' && callback(error),
      connect: jest.fn()
    }));

    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });

    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'Houston'
      },
      channel: 'We have a problem',
      handler: messageHandler
    });

    expect(logger.error).toHaveBeenCalledWith('Error receiving message from "Houston/We have a problem"', {
      error
    });
  });

  it('should return true on method isConnected when nsq is connected', () => {
    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => event === 'nsqd_connected' && callback(),
      connect: jest.fn()
    }));

    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });

    expect(messageReaderInstance.isConnected()).toBeFalsy();

    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'Houston'
      },
      channel: 'We have a problem',
      handler: messageHandler
    });

    expect(messageReaderInstance.isConnected()).toBeTruthy();
  });

  it('should touch message after some time and data has not be processed yet', () => {
    const msg = {
      hasResponded: false,
      timeUntilTimeout: () => 2000,
      requeue: () => jest.fn(),
      json: () => 'there was a time',
      finish: () => jest.fn(),
      touch: () => jest.fn()
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'message') callback(msg);
        return this;
      },
      connect: jest.fn()
    }));

    const spyTouch = jest.spyOn(msg, 'touch');

    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });
    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'once upon a time'
      },
      channel: 'never end story',
      handler: messageHandler
    });

    jest.advanceTimersByTime(5000);

    expect(spyTouch).toHaveBeenCalled();
  });

  it('should requeue message on error', () => {
    const msg = {
      json: () => jest.fn(),
      finish: () => jest.fn(),
      requeue: () => jest.fn(),
      touch: () => jest.fn()
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => event === 'message' && callback(msg),
      connect: jest.fn()
    }));

    const spyRequeue = jest.spyOn(msg, 'requeue');

    const messageHandler = {
      handle: () => {
        throw new Error('Ops');
      }
    };

    const messageReaderInstance = messageReader({ config, logger });
    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'once upon a time'
      },
      channel: 'never end story',
      handler: messageHandler
    });

    expect(messageHandler.handle).toThrowError();
    expect(spyRequeue).toHaveBeenCalled();
  });

  it('should persist connection', () => {
    const msg = {
      hasResponded: false,
      timeUntilTimeout: () => 2000,
      requeue: () => jest.fn(),
      json: () => 'there was a time',
      finish: () => jest.fn(),
      touch: () => jest.fn()
    };

    Reader.mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'nsqd_closed') callback(msg);
        else if (event === 'message') callback(msg);
        else if (event === 'nsqd_connected') jest.fn();
        return this;
      },
      connect: jest.fn()
    })).mockImplementationOnce(() => ({
      on: (event, callback) => {
        if (event === 'nsqd_connected') jest.fn();
        else if (event === 'message') callback(msg);
        return this;
      },
      connect: jest.fn()
    }));

    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });

    messageReaderInstance.initialize({
      topic: {
        key: 'MESSAGING_TOPIC_TESTING',
        value: 'once upon a time'
      },
      channel: 'never end story',
      handler: messageHandler
    });

    expect(messageHandler.handle).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);

    expect(messageHandler.handle).toHaveBeenCalledTimes(2);
  });

  it('should log an error when topic value is undefined', () => {
    const messageHandler = {
      handle: jest.fn()
    };

    const messageReaderInstance = messageReader({ config, logger });

    const topic = {
      key: 'MESSAGING_TOPIC_TESTING',
      value: undefined
    };

    messageReaderInstance.initialize({
      topic,
      channel: 'We have a problem',
      handler: messageHandler
    });

    expect(logger.error).toHaveBeenCalledWith('Missing topic: MESSAGING_TOPIC_TESTING.', {
      topic
    });
  });
});
