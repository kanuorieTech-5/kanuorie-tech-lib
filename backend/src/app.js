import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app = express();

/* =========================
   Security
========================= */
app.use(helmet());

/* =========================
   Compression
========================= */
app.use(compression());

/* =========================
   Logging
========================= */
app.use(morgan("dev"));

/* =========================
   Body Parser
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KanuorieTech API is running",
  });
});

export default app;