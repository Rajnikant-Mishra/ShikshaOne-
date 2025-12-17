import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.STRING(20),
      unique: true,
    },

    roll_number: {
      type: DataTypes.INTEGER,
    },

    first_name: DataTypes.STRING(50),
    middle_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),

    dob: DataTypes.DATEONLY,
    gender: DataTypes.ENUM("Male", "Female", "Other"),

    class_id: DataTypes.INTEGER,
    section: DataTypes.STRING(20),

    phone: DataTypes.STRING(15),
    alt_phone: DataTypes.STRING(15),
    email: DataTypes.STRING(100),

    tags: DataTypes.JSON,

    father_name: DataTypes.STRING(100),
    mother_name: DataTypes.STRING(100),
    guardian_type: {
      type: DataTypes.ENUM("Father", "Mother", "Guardian"),
      defaultValue: "Father",
    },

    address_line1: DataTypes.STRING(255),
    address_line2: DataTypes.STRING(255),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    postal_code: DataTypes.STRING(20),
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "India",
    },

    photo: DataTypes.STRING(255),
    birth_certificate: DataTypes.STRING(255),
    id_proof: DataTypes.STRING(255),
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

export default Student;
