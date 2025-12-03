import { MenuService } from "../../services/menu/menu.service.js";

export const MenuController = {
  async create(req, res) {
    try {
      const menu = await MenuService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Menu created successfully",
        data: menu,
      });
    } catch (error) {
      console.error("Error creating menu:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const menus = await MenuService.findAll();
      res.status(200).json({ success: true, data: menus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const menu = await MenuService.findById(req.params.id);
      if (!menu)
        return res
          .status(404)
          .json({ success: false, message: "Menu not found" });
      res.status(200).json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const menu = await MenuService.update(req.params.id, req.body);
      if (!menu)
        return res
          .status(404)
          .json({ success: false, message: "Menu not found" });
      res.status(200).json({
        success: true,
        message: "Menu updated successfully",
        data: menu,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await MenuService.remove(req.params.id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Menu not found" });
      res
        .status(200)
        .json({ success: true, message: "Menu deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
