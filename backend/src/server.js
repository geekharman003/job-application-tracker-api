import express from "express";
const app = express();

import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { sequelize } from "./utils/db.js";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import applicationRoutes from "./routes/application.route.js";
import reminderRoutes from "./routes/reminder.route.js";
import companyRoutes from "./routes/company.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

import {
  User,
  Application,
  Company,
  Reminder,
  Note,
  Resume,
} from "./models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/applications/:applicationId/reminders", reminderRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard/", dashboardRoutes);

await sequelize.sync({ force: false });
app.listen(ENV.PORT || 3000, async () => {
  console.log(`server is running on PORT:${ENV.PORT}`);
});
