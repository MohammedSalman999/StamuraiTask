import asyncHandler from "../utils/asyncHandler.js";
import { Stamuraiuser } from "../models/userModels.js";
import Task from "../models/taskModels.js";


// Fetch all users with role "user"
export const getUserByRoleUser = asyncHandler(async (req, res) => {
  const users = await Stamuraiuser.find({ role: "user" });

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users with role 'user' found" });
  }

  res.status(200).json({ message: "Users fetched successfully", users });
});


// Assign a task to a specific user using assignedTo (user ID)
export const assignTaskToUser = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,    
  } = req.body;

  // Step 1: Validate task fields
  if (!title || !dueDate || !priority || !assignedTo) {
    return res.status(400).json({
      message: "Title, dueDate, priority, and assignedTo are required",
    });
  }

  // Step 2: Find the user by ID
  const user = await Stamuraiuser.findById(assignedTo);
  if (!user || user.role !== "user") {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  // Step 3: Create and assign task
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status: status || "pending",
    assignedTo: user._id,
    });

  res.status(201).json({ message: "Task assigned successfully", task });
});
