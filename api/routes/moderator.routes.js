import { Router } from "express";
import {
  getUserByRoleUser,
  assignTaskToUser,
} from "../controllers/moderatorcontrollers.js";
const router = Router();

router.get("/users", getUserByRoleUser);
router.post("/assign", assignTaskToUser);

export default router;
