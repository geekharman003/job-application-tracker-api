import express from "express"
const router = express.Router();

import { getSummary } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


router.get("/summary",protectRoute, getSummary);


export default router;