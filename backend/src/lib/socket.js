const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        'https://fullstack-chatapp-production-178a.up.railway.app',
      ].filter(Boolean)
    : ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const userSocketMap = {};

exports.getReciverScoketId = (userId) => {
  return userSocketMap[userId];
};

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

module.exports = { io, app, server, ...exports };