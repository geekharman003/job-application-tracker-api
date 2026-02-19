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
    applicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true },
);

export default Application;
