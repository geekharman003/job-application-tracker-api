import express from "express";
const router = express.Router();

import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  updateAttachement,
  deleteApplication,
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} from "../controllers/application.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getReminder } from "../controllers/reminder.controller.js";

router.post("/", protectRoute, createApplication);

router.put("/:id", protectRoute, updateApplication);

// router.put(
//   "/:id/attachments",
//   protectRoute,
//   upload.single("file"),
//   updateAttachement,
// );

router.delete("/:id", protectRoute, deleteApplication);

router.get("/", protectRoute, getApplications);

router.get("/:id", protectRoute, getApplication);

// notes
router.post("/:applicationId/notes", protectRoute, createNote);

router.get("/:applicationId/notes", protectRoute, getNotes);

router.put("/:applicationId/notes/:noteId", protectRoute, updateNote);

router.delete("/:applicationId/notes/:noteId", protectRoute, deleteNote);

// reminders
router.post("/:applicationId/reminders", protectRoute, createReminder);

router.get("/:applicationId/reminders", protectRoute,getReminders);

router.put("/:applicationId/reminders/:reminderId", protectRoute,updateReminder);

router.delete("/:applicationId/reminders/:reminderId", protectRoute,deleteReminder);

export default router;
