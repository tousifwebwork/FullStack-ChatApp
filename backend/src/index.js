const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

dotenv.config();

// ---------------- App + Server ----------------
const app = express();
const server = http.createServer(app);

// ---------------- CORS (MUST BE FIRST) ----------------
app.use(
  cors({
    origin: "https://fullstack-chatapp-production-178a.up.railway.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight support (IMPORTANT for Express 5)
app.options("*", cors());

// ---------------- Body & Cookies ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------- Socket ----------------
const { initSocket } = require("./lib/socket.js");
initSocket(server);

// ---------------- Routes ----------------
const authRoutes = require("./routes/authRouter.js");
const messageRoutes = require("./routes/messageRouter.js");
const scheduleRoutes = require("./routes/scheduleRouter.js");
const insightRoutes = require("./routes/insights.js");

// ---------------- DB ----------------
const DB = require("./lib/db.js");
require("./jobs/scheduler");

// Connect DB
DB.connectDB();

// ---------------- API Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/insights", insightRoutes);

// ---------------- Frontend (PROD) ----------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // IMPORTANT: do NOT block API or preflight
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../frontend/dist/index.html")
    );
  });
}

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});