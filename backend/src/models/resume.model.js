import { sequelize } from "../utils/db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";

const Resume = sequelize.define(
  "Resume",
  {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Resume;
