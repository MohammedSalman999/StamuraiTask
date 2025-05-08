import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Load environment variables from .env file
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided for upload.");
      return null;
    }

    console.log("Uploading file to Cloudinary from:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary response:", response);
    await fs.unlink(localFilePath); // Remove the local file after upload
    return response;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);
    console.error("Error details:", error);
    try {
      await fs.unlink(localFilePath); // Clean up file if upload fails
    } catch (deleteError) {
      console.error(
        "Error deleting file after failed upload:",
        deleteError.message
      );
    }
    return null;
  }
};

export default uploadOnCloudinary;
