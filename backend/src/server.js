import express from "express";
const app = express();

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { connectToDB, sequelize } from "./utils/db.js";
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
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard/", dashboardRoutes);

// deployment code
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "..", "/frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend/dist/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "public")));
}

await sequelize.sync({ alter: false, force: false });
// await connectToDB();
app.listen(ENV.PORT || 3000, "0.0.0.0", async () => {
  console.log(`server is running on PORT:${ENV.PORT}`);
});
