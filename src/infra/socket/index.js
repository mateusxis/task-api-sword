const WebSocket = require('ws');

module.exports = ({ config, logger }) => {
  const send = (message) => {
    const socketClient = new WebSocket(`ws://${config.socket.serverAddress}:${config.socket.port}`);
    socketClient.on('open', () => {
      socketClient.send(message);
    });

    socketClient.on('close', () => {
      logger.info('Socket connection closed');
    });
  };

  return {
    send
  };
};
