import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Teacher = sequelize.define(
  "Teacher",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    emp_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    classes: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    subjects: {
      type: DataTypes.JSON,
      allowNull: false,
    },
      status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
    underscored: true,
  }
);

export default Teacher;
