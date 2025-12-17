import studentService from "../Student/student.service.js";

class StudentController {
  async create(req, res) {
    try {
      const files = req.files || {};

      const payload = {
        ...req.body,
        photo: files.photo?.[0]?.path || null,
        birth_certificate: files.birth_certificate?.[0]?.path || null,
        id_proof: files.id_proof?.[0]?.path || null,
      };

      const student = await studentService.createStudent(payload);

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
      });
    }
  }



  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";

      const data = await studentService.getStudents({
        page,
        limit,
        search,
      });

      res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      const student = await studentService.getStudentById(req.params.id);
      res.json({ success: true, student });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      await studentService.updateStudent(req.params.id, req.body);
      res.json({ success: true, message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await studentService.deleteStudent(req.params.id);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new StudentController();
