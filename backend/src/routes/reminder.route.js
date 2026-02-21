import express from "express";
import {
  createReminder,
  deleteReminder,
  getReminder,
} from "../controllers/reminder.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router({ mergeParams: true });

router.post("/", protectRoute, createReminder);

router.get("/:reminderId",protectRoute, getReminder);

router.delete("/:reminderId",protectRoute, deleteReminder);

export default router;
