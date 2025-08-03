import Board from "../models/board.model.js";
import { asyncHandler, ApiError } from "../middleware/asyncanderrorhandler.middleware.js";

// Create a new board
export const createBoard = asyncHandler(async (req, res) => {
  const { title, description, isPublic } = req.body;

  if (!title) {
    throw new ApiError("Title is required", 400);
  }

  const board = await Board.create({
    owner: req.user._id,
    title,
    description,
    isPublic,
  });

  res.status(201).json({
    success: true,
    data: board,
  });
});

// Get all boards for a user
export const getUserBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ owner: req.user._id })
    .populate("pins", "title description image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: boards,
  });
});

// Explore boards
export const exploreBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ isPublic: true })
    .populate({
        path: "owner",
        select: "name username profilePicture"
    })
    .populate({
        path: "pins",
        select: "title description image"
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: boards,
  });
});

// Get single board by ID
export const getBoardById = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId)
    .populate({
      path: "owner",
      select: "name username profilePicture"
    })
    .populate({
      path: "pins",
      select: "title description image author",
      populate: {
        path: "author",
        select: "name username"
      }
    });

  if (!board) {
    throw new ApiError("Board not found", 404);
  }

  // Check if board is public or if user is the owner
  if (!board.isPublic && (!req.user || board.owner._id.toString() !== req.user._id.toString())) {
    throw new ApiError("Access denied", 403);
  }

  res.status(200).json({
    success: true,
    data: board,
  });
});

// Update board
export const updateBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { title, description, isPublic } = req.body;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError("Board not found", 404);
  }

  // Check if user is the owner
  if (board.owner.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to update this board", 403);
  }

  // Update fields if provided
  if (title !== undefined) board.title = title;
  if (description !== undefined) board.description = description;
  if (isPublic !== undefined) board.isPublic = isPublic;

  await board.save();

  res.status(200).json({
    success: true,
    data: board,
  });
});

// Delete board
export const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError("Board not found", 404);
  }

  // Check if user is the owner
  if (board.owner.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to delete this board", 403);
  }

  await board.deleteOne();

  res.status(200).json({
    success: true,
    message: "Board deleted successfully",
  });
});

// Add pin to board
export const addPinToBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { pinId } = req.body;

  if (!pinId) {
    throw new ApiError("Pin ID is required", 400);
  }

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError("Board not found", 404);
  }

  // Check if user is the owner
  if (board.owner.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to modify this board", 403);
  }

  // Check if pin already exists in board
  if (board.pins.includes(pinId)) {
    throw new ApiError("Pin already exists in this board", 400);
  }

  board.pins.push(pinId);
  await board.save();

  const updatedBoard = await Board.findById(boardId)
    .populate({
      path: "pins",
      select: "title description image"
    });

  res.status(200).json({
    success: true,
    message: "Pin added to board successfully",
    data: updatedBoard,
  });
});

// Remove pin from board
export const removePinFromBoard = asyncHandler(async (req, res) => {
  const { boardId, pinId } = req.params;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError("Board not found", 404);
  }

  // Check if user is the owner
  if (board.owner.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to modify this board", 403);
  }

  // Check if pin exists in board
  if (!board.pins.includes(pinId)) {
    throw new ApiError("Pin not found in this board", 404);
  }

  board.pins = board.pins.filter(pin => pin.toString() !== pinId);
  await board.save();

  const updatedBoard = await Board.findById(boardId)
    .populate({
      path: "pins",
      select: "title description image"
    });

  res.status(200).json({
    success: true,
    message: "Pin removed from board successfully",
    data: updatedBoard,
  });
});
