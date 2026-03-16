import express from "express";
const router = express.Router();

import {
  deleteProfile,
  exportDataAsCSV,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteResume, uploadResume } from "../controllers/user.controller.js";

router.get("/profile", protectRoute, getProfile);

router.put("/profile", protectRoute, updateProfile);

router.delete("/profile", protectRoute, deleteProfile);

router.post("profile/resumes", protectRoute, uploadResume);

router.delete("profile/resumes/:id", protectRoute, deleteResume);

router.get("/profile/data", protectRoute, exportDataAsCSV);

export default router;
