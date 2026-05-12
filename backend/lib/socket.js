const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
const userSocketMap = {};

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://fullstack-chatapp-production-178a.up.railway.app"
      ],
      methods: ["GET", "POST"],
    },
  });

  // Authenticate socket connections using JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userID;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId.toString();
    userSocketMap[userId] = socket.id;
    console.log("🔌 Socket connected:", socket.id, "User:", userId);

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

function getReciverSoketId(userId) {
  return userSocketMap[userId.toString()];
}

function getReciverScoketId(userId) {
  return getReciverSoketId(userId);
}

module.exports = { initSocket, getIO, getReciverSoketId, getReciverScoketId };