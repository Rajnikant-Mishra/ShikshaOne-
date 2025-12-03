// service/attendance.service.js
import repo from "../../repositories/attendance/attendance.repository.js";

class AttendanceService {
  async bulkUpload(attendanceArray) {
    if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) {
      throw new Error("Attendance data must be a non-empty array");
    }

    const validStatuses = ["present", "absent", "leave"];
    attendanceArray.forEach((item) => {
      if (
        !item.student_id ||
        !item.class_id ||
        !item.roll_number ||
        !item.date ||
        !validStatuses.includes(item.attendance_status)
      ) {
        throw new Error(`Invalid attendance record: ${JSON.stringify(item)}`);         
      }
    });

    return repo.bulkCreate(attendanceArray);
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id) {
    const record = await repo.findById(id);
    if (!record) throw new Error("Attendance record not found");
    return record;
  }

  async delete(id) {
    return repo.delete(id);
  }
}

export default new AttendanceService();
