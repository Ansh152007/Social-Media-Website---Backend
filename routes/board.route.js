import express from "express";
import {
  createBoard,
  getUserBoards,
  exploreBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addPinToBoard,
  removePinFromBoard
} from "../controllers/board.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/explore", exploreBoards);
router.get("/:boardId", getBoardById);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post("/", createBoard);
router.get("/user/boards", getUserBoards);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);
router.post("/:boardId/pins", addPinToBoard);
router.delete("/:boardId/pins/:pinId", removePinFromBoard);

export default router;
