import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

import User from "./user.model.js";
import Company from "./company.model.js";

const Application = sequelize.define(
  "Application",
  {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    CompanyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      },
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salaryRange: {
      type: DataTypes.STRING,
    },
    jobLink: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "applied",
    },
    applicationDate: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
    resumeVersion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobDescription: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true },
);

export default Application;
