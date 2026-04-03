import { Sequelize } from "sequelize";
import { ENV } from "../config/env.js";


export const sequelize = new Sequelize(
  "jobapplicationtracker",
  ENV.DB_USERNAME,
  ENV.DB_PASSWORD,
  {
    host: ENV.DB_HOST,
    dialect: "mysql",
    port: 3306,
  },
);

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
