import { Router } from "express";
import {
  completeTask,
  cancelTask,
  CompletedTasks,
  CancelledTasks,
} from "../controllers/taskController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = Router();

// Complete task route
router.post("/:taskId/complete", upload.single("photo1"), completeTask);

// Reject task route
router.post("/:taskId/cancel", upload.single("photo1"), cancelTask);

// Get Completed Tasks

router.get("/tasks/completed", CompletedTasks);

// Get Cancelled Tasks

router.get("/tasks/cancelled", CancelledTasks);

export default router;
