import express from "express";
const app = express();
import { ENV } from "./config/env.js";

import { connectToDB, sequelize } from "./utils/db.js";
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

app.use("/", (req, res) => {
  res.send("Home route");
});

await sequelize.sync({ force: false });
app.listen(ENV.PORT || 3000, () => {
  console.log(`server is running on PORT:${ENV.PORT}`);
});
