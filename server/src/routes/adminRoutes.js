import express from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminResources,
  createResource,
  deleteResource,
  seedDefaultResources,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/resources", getAdminResources);
router.post("/resources", createResource);
router.post("/resources/seed-defaults", seedDefaultResources);
router.delete("/resources/:id", deleteResource);

export default router;