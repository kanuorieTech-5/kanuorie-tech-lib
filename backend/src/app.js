const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

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
const libraryRoutes = require("./routes/libraryRoutes");
const communityRoutes = require("./routes/communityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const logger = require("./middleware/logger");
const rateLimiter = require("./middleware/rateLimiter");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isAllowedVercelPreview = (origin) => {
  if (!origin) {
    return false;
  }

  try {
    const url = new URL(origin);

    if (url.protocol !== "https:") {
      return false;
    }

    if (url.hostname === "kanuorie-tech-lib-ne15.vercel.app") {
      return true;
    }

    return (
      url.hostname.startsWith("kanuorie-tech-lib-ne15-") &&
      url.hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
};

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and health checks.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        isAllowedVercelPreview(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      console.error(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `CORS policy does not allow origin: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    optionsSuccessStatus: 204,
  })
);

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(logger);
app.use(rateLimiter);

const API = "/api/v1";

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

app.get(API, (req, res) => {
  res.status(200).json({
    success: true,
    name: "KanuorieTech API",
    version: "1.0.0",
    status: "Running",
    documentation: "/api/docs",
  });
});

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/admin`, adminRoutes);
app.use(`${API}/books`, bookRoutes);
app.use(`${API}/courses`, courseRoutes);
app.use(`${API}/library`, libraryRoutes);
app.use(`${API}/community`, communityRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/certificates`, certificateRoutes);
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

app.use(notFound);
app.use(errorHandler);

module.exports = app;



