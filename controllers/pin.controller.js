import Pin from '../models/pins.model.js';
import { asyncHandler, ApiError } from '../middleware/asyncanderrorhandler.middleware.js';
import { uploadImage, deleteImage } from '../utilities/cloudinary.js';

// create pin
export const createPin = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
    if (!title || !description) {
    throw new ApiError("Title and description are required", 400);
  }
  if (!category) {
    throw new ApiError("Category is required", 400);
  }
  if (req.file) {
    const image = await uploadImage(req.file);
    if (!image) {
      throw new ApiError("Image upload failed", 500);
    }
    if (!image.secure_url) {
      throw new ApiError("Image URL not found", 500);
    }
    // Create pin with uploaded image
    const pin = await Pin.create({
      title,
      description,
      category,
      image: image.secure_url,
      author: req.id, // Set the author to the current user
    });
    res.status(201).json({
      success: true,
      data: pin,
    });
  }
});

// delete pin
export const deletePin = asyncHandler(async (req, res) => {
  const { pinId } = req.params;

  const pin = await Pin.findById(pinId);

  if (!pin) {
    throw new ApiError("Pin not found", 404);
  }

  if (pin.author.toString() !== req.id.toString()) {
    throw new ApiError("You are not authorized to delete this pin", 403);
  }

  await pin.deleteOne(); 

  if (pin.image) {
    const imageUrl = pin.image;
    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
    await deleteImage(publicId); // Delete image from Cloudinary
  }

  res.status(200).json({
    success: true,
    message: "Pin deleted successfully",
  });
});

// Get all pins for explore page
export const getAllPins = asyncHandler(async (req, res) => {
  const pins = await Pin.find()
  .sort({ createdAt: -1 }) // Sort by creation date, newest first
  .limit(100) // Limit to 100 pins for performance
  .populate({
    path: 'author',
    select: 'name username profilePicture',
  });
  res.status(200).json({
    success: true,
    data: pins,
  });
});

