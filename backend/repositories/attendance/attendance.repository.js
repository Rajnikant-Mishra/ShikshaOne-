// repository/attendance.repository.js
import Attendance from "../../models/attendance/attendance.model.js";
import Student from "../../models/student/student.model.js";

class AttendanceRepository {
  async bulkCreate(attendanceArray) {
    return Attendance.bulkCreate(attendanceArray, { validate: true });
  }

  async findAll() {
    return Attendance.findAll();
  }

  async findById(id) {
    return Attendance.findByPk(id);
  }

  async delete(id) {
    const record = await this.findById(id);
    if (!record) throw new Error("Attendance record not found");
    return record.destroy();
  }
}

export default new AttendanceRepository();
