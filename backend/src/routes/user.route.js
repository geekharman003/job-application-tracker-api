import express from "express";
const router = express.Router();

import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

router.get("/profile", protectRoute, getProfile);

router.put("/profile", protectRoute, updateProfile);

export default router;
