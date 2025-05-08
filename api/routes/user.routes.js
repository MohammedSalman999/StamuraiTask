import Router from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserTasks,
  } from "../controllers/usercontrollers.js";
import { upload } from "../middlewares/multerMiddleware.js";
const router = Router();


// User signup route
router.post("/signup", upload.single("avatar"),registerUser);

// User login route
router.post("/login", loginUser);

// User logout route
router.post("/logout", logoutUser);

// Task summary aur list lane ka route
router.get("/:userId", getUserTasks);



export default router; // Router ko export kiya
