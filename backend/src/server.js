import express from "express";
const app = express();

import { sequelize } from "./utils/db.js";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

import {
  User,
  Application,
  Attachment,
  Company,
  Reminder,
  JobListing,
} from "./models/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
  res.send("Home route");
});

await sequelize.sync({ force: false });
app.listen(ENV.PORT || 3000, () => {
  console.log(`server is running on PORT:${ENV.PORT}`);
});
