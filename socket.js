const container = require('./src/container');
const socketServer = container.resolve('socketServer');

socketServer.start();
