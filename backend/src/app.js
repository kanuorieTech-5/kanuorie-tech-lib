const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ==========================================
   ENVIRONMENT VALIDATION
========================================== */

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }
});

/* ==========================================
   ROUTES
========================================== */

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const bookRoutes = require("./routes/bookRoutes");
const courseRoutes = require("./routes/courseRoutes");
const progressRoutes = require("./routes/progressRoutes");

const productRoutes = require("./routes/productRoutes");
const projectRoutes = require("./routes/projectRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const blogRoutes = require("./routes/blogRoutes");
const faqRoutes = require("./routes/faqRoutes");
const teamRoutes = require("./routes/teamRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

/* ==========================================
   MIDDLEWARE
========================================== */

const logger = require("./middleware/logger");
const rateLimiter = require("./middleware/rateLimiter");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

/* ==========================================
   CORS
========================================== */

const allowedOrigins = process.env.CLIENT_URL
  .split(",")
  .map((origin) => origin.trim());

/* ==========================================
   SECURITY
========================================== */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS policy does not allow this origin.")
      );
    },
    credentials: true,
  })
);

/* ==========================================
   BODY PARSERS
========================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ==========================================
   LOGGING
========================================== */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(logger);

/* ==========================================
   RATE LIMITING
========================================== */

app.use(rateLimiter);

/* ==========================================
   API VERSION
========================================== */

const API = "/api/v1";

/* ==========================================
   HEALTH CHECK
========================================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment:
      process.env.NODE_ENV || "development",
    version: "1.0.0",
    message: "KanuorieTech API is running 🚀",
  });
});

/* ==========================================
   API ROOT
========================================== */

app.get(API, (req, res) => {
  res.status(200).json({
    success: true,
    name: "KanuorieTech API",
    version: "1.0.0",
    status: "Running",
    documentation: "/api/docs",
  });
});

/* ==========================================
   ROUTES
========================================== */

app.use(`${API}/auth`, authRoutes);

app.use(`${API}/users`, userRoutes);

app.use(`${API}/admin`, adminRoutes);

app.use(`${API}/books`, bookRoutes);

app.use(`${API}/courses`, courseRoutes);

app.use(`${API}/progress`, progressRoutes);

app.use(`${API}/products`, productRoutes);

app.use(`${API}/projects`, projectRoutes);

app.use(`${API}/services`, serviceRoutes);

app.use(`${API}/blog`, blogRoutes);

app.use(`${API}/faq`, faqRoutes);

app.use(`${API}/team`, teamRoutes);

app.use(`${API}/testimonials`, testimonialRoutes);

app.use(`${API}/newsletter`, newsletterRoutes);

app.use(`${API}/notifications`, notificationRoutes);

app.use(`${API}/contact`, contactRoutes);

app.use(`${API}/upload`, uploadRoutes);

/* ==========================================
   404 HANDLER
========================================== */

app.use(notFound);

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(errorHandler);

module.exports = app;