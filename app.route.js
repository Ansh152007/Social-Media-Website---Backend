import express from "express";
import healthchecker from "./routes/health.check.route.js";
import userRoutes from "./routes/user.route.js";
import PinRoutes from "./routes/pin.route.js";
import boardRoutes from "./routes/board.route.js";

const router = express.Router();

// Define the health check route
router.use("/healthstatus", healthchecker)

// Define user-related routes
router.use("/user", userRoutes);

// Define pin-related routes
router.use("/pin", PinRoutes);

// Define board-related routes
router.use("/board", boardRoutes);

export default router;