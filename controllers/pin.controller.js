import Pin from '../models/pin.model.js';
import { asyncHandler, ApiError } from '../middleware/asyncanderrorhandler.middleware.js';
import { uploadImage, deleteImage } from '../utilities/cloudinary.js';

// create pin
export const createPin = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
    if (!title || !description) {
    throw new ApiError("Title and description are required", 400);
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
      image: image.secure_url,
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
    throw new ApiError(404, "Pin not found");
  }

  if (pin.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this pin");
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
    path: 'owner',
    select: 'name avatar',
  }).populate({
    path: 'image',
    select: 'url',
  });
  res.status(200).json({
    success: true,
    data: pins,
  });
});

