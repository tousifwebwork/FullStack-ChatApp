const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

// Routes
const authRoutes = require('./routes/authRouter.js');
const messageRoutes = require('./routes/messageRouter.js');
const scheduleRoutes = require('./routes/scheduleRouter.js');
const InsighRouter = require('./routes/insights.js');

// DB + Socket (IMPORTANT: same app & server)
const DB = require('./lib/db.js');
const { app, server } = require('./lib/socket.js');

// Start background jobs
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
      if (!origin) return callback(null, true); // Postman / server calls

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ---------------- Middlewares ----------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ---------------- DB ----------------
DB.connectDB();

// ---------------- API Routes ----------------
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/insights', InsighRouter);

// ---------------- Frontend (Production) ----------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../../frontend/dist/index.html')
    );
  });
}

// ---------------- Server Start ----------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});