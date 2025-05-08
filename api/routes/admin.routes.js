import { Router } from "express";
// Admin controller se getAdminDashboard function ko import karna
import { getAdminDashboard } from "../controllers/adminController.js";

// Naya router banane ke liye
const router = Router();

// Admin dashboard route ko define karna
// Ye route GET request accept karega aur userId parameter lega
router.get("/:userId", getAdminDashboard);

// Router ko export karna taki dusre files me use kar sake
export default router;