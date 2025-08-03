// Import necessary modules
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
import appRoutes from "./app.route.js"; // Import your application routes
import viewRoutes from "./routes/views.route.js"; // Import view routes

const app = express();
const PORT = process.env.PORT || 8000;

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

//Helmet
app.use(helmet());

//Cors Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URI || `http://localhost:${PORT}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

//logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", limiter);

//Body and cookie Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//DATA SANITIZATION MIDDLEWARE
app.use(mongoSanitize());
app.use(hpp());

// Mount view routes (EJS pages)
app.use("/", viewRoutes);

// Mounting all the routes on /api
app.use("/api", appRoutes);

//Global Error Handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error("💥 Development Error Stack:", err.stack);
    res.status(err.status).json({
      status: "error",
      message: err.message || "Internal Server Error",
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(err.status).json({
        status: err.status,
        message: err.message || "Internal Server Error",
      });
    } else {
      console.error("💥 Production Error Stack:", err.stack);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
});

export default app;
