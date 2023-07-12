const socketClient = require('./socket');
const WebSocket = require('ws');

jest.mock('ws');

const logger = {
  info: jest.fn(() => {})
};

const config = {
  socket: {
    serverAddress: 'localhost',
    port: 4150
  }
};

describe('socketClient()', () => {
  it('must connect and publish a message successfully', () => {
    const webSocketFunctions = {
      on: (event, callback) => event === 'open' && callback(),
      send: jest.fn()
    };
    const spyFinishSocketClient = jest.spyOn(webSocketFunctions, 'send');

    WebSocket.mockImplementationOnce(() => webSocketFunctions);

    const socketClientInstance = socketClient({
      config,
      logger
    });

    expect(socketClientInstance).toBeDefined();

    socketClientInstance.send('foo');

    expect(spyFinishSocketClient).toHaveBeenCalledWith('foo');
    expect(logger.info).toHaveBeenCalledWith('socket sending message');
  });

  it('should log when disconnect', () => {
    const webSocketFunctions = {
      on: (event, callback) => event === 'close' && callback(),
      send: jest.fn()
    };

    WebSocket.mockImplementationOnce(() => webSocketFunctions);
    const socketClientInstance = socketClient({
      config,
      logger
    });

    expect(socketClientInstance).toBeDefined();
    socketClientInstance.send('foo');
    expect(logger.info).toHaveBeenCalledWith('socket connection closed');
  });
});
