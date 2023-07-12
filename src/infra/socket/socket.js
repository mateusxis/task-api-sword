const WebSocket = require('ws');

module.exports = ({ config, logger }) => {
  const send = (message) => {
    const socketClient = new WebSocket(`ws://${config.socket.serverAddress}:${config.socket.port}`);
    socketClient.on('open', () => {
      logger.info('socket sending message');
      socketClient.send(message);
    });

    socketClient.on('close', () => {
      logger.info('socket connection closed');
    });
  };

  return {
    send
  };
};
