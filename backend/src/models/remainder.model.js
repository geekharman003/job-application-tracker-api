import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";
import Application from "./application.model.js";

const Reminder = sequelize.define(
  "Reminder",
  {
    ApplicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: Application,
        key: "id",
      },
    },
    remainderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
  },
  { timestamps: true },
);

export default Reminder;
