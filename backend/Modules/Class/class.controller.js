import service from "../../Modules/Class/class.service.js";

class StudentClassController {
  //create
  async create(req, res) {
    try {
      const result = await service.create(req.body);
      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  //getall
  // async getAll(req, res) {
  //   try {
  //     const list = await service.getAll();
  //     res.json({ success: true, data: list });
  //   } catch (err) {
  //     res.status(500).json({ success: false, error: err.message });
  //   }
  // }

  async getAll(req, res) {
    try {
      const result = await service.getAll(req.query);

      res.json({
        success: true,
        pagination: {
          total: result.count,
          page: parseInt(req.query.page) || 1,
          limit: parseInt(req.query.limit) || 10,
          totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        },
        data: result.rows,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const result = await service.getOne(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json({
        success: true,
        message: "updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await service.delete(req.params.id);
      res.json({ success: true, result });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }
}

export default new StudentClassController();
