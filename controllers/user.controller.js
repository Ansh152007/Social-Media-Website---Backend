import { User } from "../models/user.model.js";
import genToken from "../utilities/genToken.js";
import {
  asyncHandler,
  ApiError,
} from "../middleware/asyncanderrorhandler.middleware.js";
import multupload from "../utilities/multer.js";
import { uploadImage, deleteImage } from "../utilities/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  // Create new user
  const user = await User.create({
    name,
    email : email.toLowerCase(),
    password
  });

  if (!user) {
    throw new ApiError("User registration failed", 500);
  }

  // Generate token
  const token = genToken(res, user, "User registered successfully");
  
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // If user does not exist or password is incorrect
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError("Invalid email or password", 401);
    }
    // Generate token
    genToken(res, user, "User logged in successfully");
});

export const logoutUser = asyncHandler(async (_, res) => {
    res.cookie("token", "", {maxAge: 0})
    res.staus(200).json({
      success: true,
      message: "User logged out successfully",
    });
});

export const currentUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.id)
  .populate({
    path : "createdPins",
    select : "title description image",
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
    data : {
        ...user.toJSON(),
        totalPins: user.totalpins,
        totalBoards: user.totalboards,
    }
  });
});

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
        }
    });
});