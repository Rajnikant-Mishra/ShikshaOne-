import teacherService from "../Teacher/teacher.service.js";

class TeacherController {
  async create(req, res) {
    try {
      const teacher = await teacherService.createTeacher(req.body);
      res.status(201).json({
        message: "Teacher created successfully",
        teacher,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await teacherService.getAll(req.query);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      res.json({
        success: true,
        pagination: {
          total: result.count,
          page,
          limit,
          totalPages: Math.ceil(result.count / limit),
        },
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      res.json(teacher);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const teacher = await teacherService.updateTeacher(
        req.params.id,
        req.body
      );
      res.json({
        message: "Teacher updated successfully",
        teacher,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await teacherService.deleteTeacher(req.params.id);
      res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new TeacherController();
