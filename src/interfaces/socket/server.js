const WebSocket = require('ws');

const LIST_ROLES_WITH_AUTHORIZATION = ['MANAGER'];

let clients = [];

module.exports = ({ config, logger, authentication, eventHandler }) => {
  const server = new WebSocket.Server({ port: config.socket.port });
  const getIdentifier = () => 'Socket server';

  const handleHandshake = (socket, req) => {
    const headers = req.headers;
    const token = headers['sec-websocket-protocol'];
    const user = authentication.decode(token);
    if (!user) {
      return;
    }
    socket.user = user;
  };

  const start = async () => {
    await eventHandler.initialize();

    server.on('connection', (socket, req) => {
      handleHandshake(socket, req);
      clients.push(socket);

      socket.on('message', (message) => {
        clients.forEach((client) => {
          if (
            client !== socket &&
            client.readyState === WebSocket.OPEN &&
            LIST_ROLES_WITH_AUTHORIZATION.includes(client?.user?.role)
          ) {
            client.send(message);
          }
        });
      });

      socket.on('close', () => {
        logger.info('WebSocket server is stopped');
        clients = [];
      });

      socket.on('listening', () => {
        logger.info('WebSocket server is running');
      });

      socket.on('error', (error) => {
        logger.error('WebSocket server encountered an error:', {
          identifier: getIdentifier(),
          error: error.message
        });
      });
    });
  };

  return {
    start
  };
};
