const logger = require('../../../logs/logger');

let io;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: {
        origin: '*', // Update for production to allow specific origins
        methods: ['GET', 'POST', 'PUT'],
      },
    });

    // Define basic Socket.IO events
    io.on('connection', (socket) => {
      logger.info(`A user connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.info(`User disconnected: ${socket.id}`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new logger.error('Socket.IO not initialized!');
    }
    return io;
  },
};
