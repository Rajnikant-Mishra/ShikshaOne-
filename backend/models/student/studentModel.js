import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "../User/userModel.js"; // Import User model

const Student = sequelize.define(
  "Student",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User, // Reference User table
        key: "id", // Column in User table
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    roll_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    aadhaar_card: {
      type: DataTypes.STRING(12),
      allowNull: true,
      unique: true,
    },

    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },

    grades: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
    tableName: "students",
    underscored: true,
  }
);

// Association: Student belongs to User
Student.belongsTo(User, { foreignKey: "user_id", as: "user" });


export default Student;
