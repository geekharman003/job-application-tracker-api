import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

import User from "./user.model.js";

const Company = sequelize.define(
  "Company",
  {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key:"id"
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    contactEmail: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true },
);

export default Company;
