import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

const Company = sequelize.define(
  "Company",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
  },
  { timestamps: true },
);

export default Company;
