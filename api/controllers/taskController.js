import asyncHandler from "../utils/asyncHandler.js";
import Stamuraitask from "../models/taskModels.js"; // renamed import
import uploadOnCloudinary from "../utils/cloudinaryConfig.js";

// Complete a task
export const completeTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Stamuraitask.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const photo1 = await uploadOnCloudinary(avatarLocalPath);
  if (!photo1 || !photo1.secure_url) {
    console.error("Cloudinary upload failed");
    return res.status(500).json({ message: "Failed to upload avatar" });
  }

  task.status = "completed";
  task.photo1 = photo1.secure_url;

  await task.save();

  res.status(200).json({ message: "Task marked as complete", task });
});

// Reject a task
export const cancelTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Stamuraitask.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const photo1 = await uploadOnCloudinary(avatarLocalPath);
  if (!photo1 || !photo1.secure_url) {
    console.error("Cloudinary upload failed");
    return res.status(500).json({ message: "Failed to upload avatar" });
  }

  task.status = "cancelled";
  task.photo1 = photo1.secure_url;

  await task.save();

  res.status(200).json({ message: "Task cancelled", task });
});

// Get completed tasks
export const CompletedTasks = asyncHandler(async (req, res) => {
  try {
    const completedTasks = await Stamuraitask.find({ status: "completed" });
    res.status(200).json({
      message: "Completed Tasks fetched successfully",
      completedTasks,
    });
  } catch (error) {
    console.error("Error in completed task fetch :", error);
  }
});

// Get cancelled tasks
export const CancelledTasks = asyncHandler(async (req, res) => {
  try {
    const cancelledTasks = await Stamuraitask.find({ status: "cancelled" });
    res.status(200).json({
      message: "Cancelled tasks Fetched successfully",
      cancelledTasks,
    });
  } catch (error) {
    console.error("Error in fetching cancelled tasks ", error);
  }
});
