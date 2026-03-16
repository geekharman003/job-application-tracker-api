import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";
import Application from "./application.model.js";

const Reminder = sequelize.define(
  "Reminder",
  {
    ApplicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Application,
        key: "id",
      },
      allowNull: false,
    },
    reminderDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reminderMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true },
);

export default Reminder;
