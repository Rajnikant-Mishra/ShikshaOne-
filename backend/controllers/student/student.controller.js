import service from "../../services/student/student.service.js";
import path from "path";
import fs from "fs";

class StudentController {
  async create(req, res) {
    try {
      const body = req.body;
      if (req.file) body.student_image = req.file.filename;

      const student = await service.create(body);

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Failed to create student",
        errors: [err.message],
      });
    }
  }

  // async create(req, res) {
  //   try {
  //     const body = { ...req.body };
  //     if (req.file) body.student_image = req.file.filename;

  //     const student = await service.create(body);

  //     return res.status(201).json({
  //       success: true,
  //       message: "Student created successfully",
  //       data: student,
  //     });
  //   } catch (err) {
  //     // delete uploaded file if creation fails
  //     if (req.file) {
  //       const filePath = path.join(process.cwd(), "uploads", req.file.filename);
  //       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       message: "Failed to create student",
  //       errors: [err.message],
  //     });
  //   }
  // }

  async getAll(req, res) {
    try {
      const { rows, count } = await service.getAll(req.query);

      return res.json({
        success: true,
        total: count,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        data: rows,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await service.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const body = req.body;
      const oldImage = body.existing_image;

      if (req.file) {
        body.student_image = req.file.filename;

        if (oldImage && oldImage !== req.file.filename) {
          const oldPath = path.join("./uploads", oldImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const result = await service.update(req.params.id, body);
      res.json({ success: true, result });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const student = await service.getById(req.params.id);
      if (student.student_image) {
        const imagePath = path.join("./uploads", student.student_image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      const result = await service.delete(req.params.id);
      res.json({ success: true, result });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }
}

export default new StudentController();
