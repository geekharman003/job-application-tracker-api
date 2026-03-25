import express from "express";
const router = express.Router();

import multer from "multer";

import {
  deleteProfile,
  exportDataAsCSV,
  getProfile,
  updateProfile,
  getResumes,
  updateProfilePic,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteResume, uploadResume } from "../controllers/user.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/profile", protectRoute, getProfile);

router.put("/profile", protectRoute, updateProfile);

router.delete("/profile", protectRoute, deleteProfile);

router.post(
  "/profile-image",
  protectRoute,
  upload.single("profileImage"),
  updateProfilePic,
);

router.post(
  "/profile/resumes",
  protectRoute,
  upload.single("resume"),
  uploadResume,
);

router.get("/profile/resumes", protectRoute, getResumes);

router.delete("/profile/resumes/:id", protectRoute, deleteResume);

router.get("/profile/data", protectRoute, exportDataAsCSV);

export default router;
