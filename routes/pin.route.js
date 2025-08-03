import express from "express";
import { createPin, deletePin, getAllPins } from "../controllers/pin.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
const router = express.Router();

// Route to create a pin
router.post("/", isAuthenticated, createPin);
// Route to delete a pin
router.delete("/:pinId", isAuthenticated, deletePin);
// Route to get all pins for the explore page
router.get("/", getAllPins);

export default router;
