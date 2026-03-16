import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

const Company = sequelize.define(
  "Company",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Company;
