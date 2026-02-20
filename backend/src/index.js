const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');

dotenv.config();

// ---------------- App + Server ----------------
const app = express();
const server = http.createServer(app);

// ---------------- Socket ----------------
const { initSocket } = require('./lib/socket.js');
initSocket(server); // ✅ VERY IMPORTANT

// ---------------- Routes ----------------
const authRoutes = require('./routes/authRouter.js');
const messageRoutes = require('./routes/messageRouter.js');
const scheduleRoutes = require('./routes/scheduleRouter.js');
const InsighRouter = require('./routes/insights.js');

// ---------------- DB ----------------
const DB = require('./lib/db.js');
require('./jobs/scheduler');

// ---------------- CORS ----------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://fullstack-chatapp-production-178a.up.railway.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// ---------------- Middlewares ----------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------- DB Connect ----------------
DB.connectDB();

// ---------------- API Routes ----------------
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/insights', InsighRouter);

// ---------------- Frontend ----------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
  });
}

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});