import User from "../models/user.model.js";
import genToken from "../utilities/genToken.js";
import {
  asyncHandler,
  ApiError,
} from "../middleware/asyncanderrorhandler.middleware.js";
import { uploadImage, deleteImage } from "../utilities/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  // Create new user
  const userData = {
    name,
    email: email.toLowerCase(),
    password,
  };

  if (req.file) {
    const avatarResult = await uploadImage(req.file.path);
    if (avatarResult) {
      userData.avatar = avatarResult.secure_url;
    }
  }

  const user = await User.create(userData);

  if (!user) {
    throw new ApiError("User registration failed", 500);
  }

  // Generate token
  genToken(res, user, "User registered successfully");
});

// User login handler
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  // If user does not exist or password is incorrect
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }
  // Generate token
  genToken(res, user, "User logged in successfully");
});

// User logout handler
export const logoutUser = asyncHandler(async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// Get current user profile
export const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.id)
    .populate({
      path: "createdPins",
      select: "title description image",
    })
    .populate({
      path: "createdBoards",
      select: "title description",
    });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalPins: user.totalpins,
      totalBoards: user.totalboards,
    },
  });
});

// Get user profile by ID
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select("-email -password -resetPasswordToken -resetPasswordExpire")
    .populate({
      path: "createdPins",
      select: "title description image",
    })
    .populate({
      path: "createdBoards",
      select: "title description",
    });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalPins: user.totalpins,
      totalBoards: user.totalboards,
    },
  });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.id);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const { name, email, bio } = req.body;

  const updatedData = {
    name,
    email: email.toLowerCase(),
    bio,
  };

  if (req.file) {
    const avatarResult = await uploadImage(req.file.path);
    if (avatarResult) {
      if (user.avatar && user.avatar !== "default-avatar.png") {
        await deleteImage(user.avatar);
      }
      updatedData.avatar = avatarResult.secure_url;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.id, updatedData, {
    new: true,
  });

  if (!updatedUser) {
    throw new ApiError("User profile update failed", 500);
  }

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});
