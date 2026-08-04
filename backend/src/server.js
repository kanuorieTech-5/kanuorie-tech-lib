require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

/* ==========================================
   START SERVER
========================================== */

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Create HTTP Server
    const server = http.createServer(app);

    // Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL
          ? process.env.CLIENT_URL.split(",")
          : "*",
        credentials: true,
      },
    });

    // Make Socket.IO available throughout the app
    app.set("io", io);

    /* ==========================================
       SOCKET CONNECTIONS
    ========================================== */

    io.on("connection", (socket) => {
      console.log(`🟢 Socket Connected: ${socket.id}`);

      socket.on("join", (userId) => {
        if (!userId) return;

        socket.join(`user_${userId}`);

        console.log(
          `👤 User ${userId} joined room user_${userId}`
        );
      });

      socket.on("disconnect", () => {
        console.log(
          `🔴 Socket Disconnected: ${socket.id}`
        );
      });
    });

    /* ==========================================
       START LISTENING
    ========================================== */

    server.listen(PORT, () => {
      console.log(`
/* ==================================================
🚀 KanuorieTech API Started Successfully
================================================== */
Environment : ${process.env.NODE_ENV || "development"}
Port        : ${PORT}
MongoDB     : Connected
Socket.IO   : Enabled
`);
    });

    /* ==========================================
       GRACEFUL SHUTDOWN
    ========================================== */

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down...`);

      server.close(() => {
        console.log("HTTP Server Closed");

        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));

    /* ==========================================
       UNHANDLED PROMISE REJECTIONS
    ========================================== */

    process.on("unhandledRejection", (err) => {
      console.error(
        "Unhandled Rejection:",
        err.message
      );

      server.close(() => process.exit(1));
    });

    /* ==========================================
       UNCAUGHT EXCEPTIONS
    ========================================== */

    process.on("uncaughtException", (err) => {
      console.error(
        "Uncaught Exception:",
        err.message
      );

      process.exit(1);
    });

  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

/* ==========================================
   BOOTSTRAP
========================================== */

startServer();