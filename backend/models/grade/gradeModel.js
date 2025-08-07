import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Grade = sequelize.define(
  "Grade",
  {
    grade_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "grades",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Grade;
