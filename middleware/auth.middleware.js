import { asyncHandler, ApiError } from "./asyncanderrorhandler.middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("Not authorized", 401);
  }

 try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.id = decoded.userID
     next();
 } catch (error) {
     throw new ApiError("Not authorized", 401);
 }
});
