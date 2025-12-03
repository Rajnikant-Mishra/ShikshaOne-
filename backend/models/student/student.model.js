import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),  
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    student_image: {
      // CHANGED FROM student_photo
      type: DataTypes.STRING,
      allowNull: true,
    },
    admission_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    student_class: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    roll_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    parent_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    parent_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    parent_mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

export default Student;
