// models/attendance.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roll_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attendance_status: {
    type: DataTypes.ENUM("present", "absent", "leave"),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

export default Attendance;
