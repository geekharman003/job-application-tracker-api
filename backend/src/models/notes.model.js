import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";
import Application from "./application.model.js";

const Note = sequelize.define(
  "Note",
  {
    ApplicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Application,
        key: "id",
      },
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Note;
