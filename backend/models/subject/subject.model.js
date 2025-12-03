import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const StudentClass = sequelize.define(
  "subject",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    subject_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Subject name is required" },
        len: {
          args: [2, 100],
          msg: "Subject name must be between 2 and 100 characters",
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
    tableName: "subject",
    timestamps: true,
    paranoid: true,
  }
);

export default StudentClass;
