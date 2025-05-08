import asyncHandler from "../utils/asyncHandler.js";
import { Stamuraiuser } from "../models/userModels.js"; // Changed to Stamuraiuser
import Stamuraitask from "../models/taskModels.js"; // Changed to Stamuraitask
import uploadOnCloudinary from "../utils/cloudinaryConfig.js";

// User Registration (signup)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, city } = req.body;

  // Check if the email already exists
  const existingUser = await Stamuraiuser.findOne({ email }); // Changed to Stamuraiuser
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Get the local path of the uploaded avatar
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({
      message: "Avatar file is required",
    });
  }

  // Upload avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar || !avatar.url) {
    console.error("Cloudinary upload failed");
    return res.status(500).json({
      message: "Failed to upload avatar",
    });
  }

  // Create a new user (role jo hai wo bydefault user rahega)
  const newUser = await Stamuraiuser.create({ // Changed to Stamuraiuser
    name,
    email,
    password,
    city,
    avatar: avatar.url,
  });

  // Generate tokens
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  // Save tokens in the database
  newUser.accessToken = accessToken;
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // Send response with tokens and user info
  res.status(201).json({
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user: {
      name: newUser.name,
      email: newUser.email,
      city: newUser.city,
      role: newUser.role, // role response me assign kiya
      avatar: newUser.avatar,
    },
  });
});

// loginUser function will handle the /api/users/login (post method )
// and in response it will give us refresh token , assess token , and
// user details == {name, email, password }
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Email", email, "Password", password);
  // Find user by email
  const user = await Stamuraiuser.findOne({ email }); // Changed to Stamuraiuser
  if (!user || !(await user.isPasswordCorrect(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Set refresh token in cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Send response with task summary and tasks
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    message: "Login successful",
    accessToken,
    refreshToken,
  });
});

// User Logout
export const logoutUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await Stamuraiuser.findOne({ email }); // Changed to Stamuraiuser
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove tokens from database
  user.accessToken = null;
  user.refreshToken = null;
  await user.save();

  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
  });

  // Send response
  res.status(200).json({
    message: "Logout successful",
  });
});

// getUserTasks function will handle the get/login request
export const getUserTasks = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find tasks assigned to the user
  const tasks = await Stamuraitask.find({ assignedTo: userId }); // Changed to Stamuraitask

  // Summary create karo
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const cancelledTasks = tasks.filter(
    (task) => task.status === "cancelled"
  ).length;

  res.status(200).json({
    message: "Tasks fetched successfully",
    tasksSummary: {
      total: totalTasks,
      pending: pendingTasks,
      completed: completedTasks,
      cancelled: cancelledTasks,
    },
    tasks,
  });
});
