import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const StudentClass = sequelize.define(
  "student_class",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Class name is required" },
        len: {
          args: [2, 100],
          msg: "Class name must be between 2 and 100 characters",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "student_class",
    timestamps: true,
    paranoid: true, // enables soft delete
  }
);

export default StudentClass;
