import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    linkedInUrl: {
      type: DataTypes.STRING,
    },
    githubUrl: {
      type: DataTypes.STRING,
    },
    profilePicUrl: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true },
);

export default User;
