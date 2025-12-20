const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

// CORS configuration for Socket.IO
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

// Store online users: { odId: socketId }
const userSocketMap = {};

/**
 * Get socket ID for a specific user
 * @param {string} userId - User's MongoDB ID
 * @returns {string|undefined} - Socket ID or undefined
 */
exports.getReciverScoketId = (userId) => {
  return userSocketMap[userId];
};

// Handle socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast online users to all clients
  io.emit('get-online-users', Object.keys(userSocketMap));

  // Handle disconnection
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('get-online-users', Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, ...exports };