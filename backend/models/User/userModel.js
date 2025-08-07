import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define(
  "User",
  {
    role: {
      type: DataTypes.INTEGER, // 1 = admin, 2 = student, etc.
      allowNull: false,
    },

    username: {
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

    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for admin
    },

    section: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable for admin
    },

    roll_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },

    student_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;
