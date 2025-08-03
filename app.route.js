import express from "express";
import healthchecker from "./routes/health.check.route.js";
import userRoutes from "./routes/user.route.js";


const router = express.Router();

// Define the health check route
router.use("/healthstatus", healthchecker)

// Define user-related routes
router.use("/user", userRoutes);

export default router;