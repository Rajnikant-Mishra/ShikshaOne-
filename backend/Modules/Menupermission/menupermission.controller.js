import { RoleMenuService } from "../Menupermission/menupermission.service.js";

export const RoleMenuController = {
  async assignMenu(req, res) {
    try {
      const { menu_id, role_ids } = req.body;
      const result = await RoleMenuService.assignMenu(menu_id, role_ids);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to assign menu to roles",
      });
    }
  },

  async getMenusByRole(req, res) {
    try {
      const { role_id } = req.params;
      const result = await RoleMenuService.getMenusByRole(role_id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch menus for the role",
      });
    }
  },

  async getAllRoleMenu(req, res) {
    try {
      const data = await RoleMenuService.getAllRoleMenu();
      res
        .status(200)
        .json({ success: true, message: "Data fetched successfully", data });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch role-menu data",
        details: err.message,
      });
    }
  },

  async deleteRoleMenu(req, res) {
    try {
      await RoleMenuService.deleteRoleMenu(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "RoleMenu deleted successfully" });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to delete role-menu mapping",
      });
    }
  },
};
