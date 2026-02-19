import { DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

import Application from "./application.model.js";

const Attachment = sequelize.define(
  "Attachment",
  {
    ApplicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application,
        key: "id",
      },
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Attachment;
