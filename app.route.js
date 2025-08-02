import express from "express";
import healthchecker from "./routes/health.check.route.js";



const router = express.Router();

// Define the health check route
router.use("/healthstatus", healthchecker)


export default router;