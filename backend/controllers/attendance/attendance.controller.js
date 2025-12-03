// controller/attendance.controller.js
import AttendanceService from "../../services/attendance/attendance.service.js";

class AttendanceController {
  async bulkUpload(req, res) {
    try {
      const attendanceArray = req.body; // expecting JSON array
      const result = await AttendanceService.bulkUpload(attendanceArray);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await AttendanceService.getAll();
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const result = await AttendanceService.getById(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await AttendanceService.delete(req.params.id);
      res.json({ success: true, message: "Attendance deleted", data: result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

export default new AttendanceController();
