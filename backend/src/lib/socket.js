const { Server } = require('socket.io'); 
const userSocketMap = {};

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://fullstack-chatapp-production-178a.up.railway.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit('get-online-users', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      delete userSocketMap[userId];
      io.emit('get-online-users', Object.keys(userSocketMap));
    });
  });
};

const getReciverScoketId = (userId) => userSocketMap[userId];

module.exports = { initSocket, getReciverScoketId };