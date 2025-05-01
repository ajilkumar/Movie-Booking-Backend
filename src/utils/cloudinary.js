import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // use promise-based fs

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "movie-app",
    });

    // console.log(`File uploaded to Cloudinary: ${response.url}`);

    await fs.unlink(localFilePath); // safe delete
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    try {
      await fs.unlink(localFilePath); // Cleanup even on error
    } catch (cleanupErr) {
      console.error("Failed to delete local file:", cleanupErr);
    }
    return null;
  }
};

export { uploadOnCloudinary };
