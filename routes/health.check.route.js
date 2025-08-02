import express from "express";
import { healthcheck} from "../controllers/healthcheck.controller.js";

const router = express.Router();

// Define the health check route
router.get("/health", healthcheck);

export default router;