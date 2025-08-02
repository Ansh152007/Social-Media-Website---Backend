import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Exporting the upload functions for image upload
export const uploadImage = async (filepath) => {
  try {
    const resultUpload = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
      folder: "social_media_app",
      use_filename: true,
      unique_filename: false,
    });

    fs.unlinkSync(filepath); // Delete the file after upload
    return resultUpload;
  } catch (error) {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    console.error("Error uploading image to Cloudinary:", error);
  }
};

// Exporting the delete function for image deletion
export const deleteImage = async (publicId) => {
  try {
    const resultDelete = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return resultDelete;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
