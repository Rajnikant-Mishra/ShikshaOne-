import RoleMenu from "../../models/configuration/role_menuModel.js";
import Menu from "../../models/Menu/menuModel.js";
import Role from "../../models/Role/roleModel.js";

export const RoleMenuService = {
    
  /** Assign menu to multiple roles */
  async assignMenu(menu_id, role_ids) {
    //Verify menu existence
    const menu = await Menu.findByPk(menu_id);
    if (!menu) {
      const error = new Error(`Menu with id ${menu_id} not found`);
      error.statusCode = 404;
      throw error;
    }

    //Verify all roles exist
    const roles = await Role.findAll({ where: { id: role_ids } });
    if (roles.length !== role_ids.length) {
      const validIds = roles.map((r) => r.id);
      const invalidIds = role_ids.filter((id) => !validIds.includes(id));
      const error = new Error(`Invalid role_id(s): ${invalidIds.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    //Prepare data for bulk insert
    const records = role_ids.map((role_id) => ({ role_id, menu_id }));

    //Insert with duplicate ignore
    await RoleMenu.bulkCreate(records, { ignoreDuplicates: true });

    return {
      message: "Menu assigned to roles successfully",
      assignedMenu: menu.title,
      assignedRoles: roles.map((r) => r.role_name),
    };
  },

  /** Fetch all menus by role ID */
  async getMenusByRole(role_id) {
    const role = await Role.findByPk(role_id);
    if (!role) {
      const error = new Error(`Role with id ${role_id} not found`);
      error.statusCode = 404;
      throw error;
    }

    const menus = await Menu.findAll({
      include: {
        model: Role,
        where: { id: role_id },
        through: { attributes: [] },
      },
    });

    return { role: role.role_name, menus };
  },

  /** Fetch all role-menu relationships */
  async getAllRoleMenu() {
    const results = await RoleMenu.findAll({
      include: [
        { model: Menu, attributes: ["title"] },
        { model: Role, attributes: ["role_name"] },
      ],
    });

    return results.map((rm) => ({
      id: rm.id,
      menu_title: rm.Menu?.title || null,
      role_name: rm.Role?.role_name || null,
      created_at: rm.created_at,
    }));
  },

  /** Delete role-menu mapping */
  async deleteRoleMenu(id) {
    const deleted = await RoleMenu.destroy({ where: { id } });
    if (!deleted) {
      const error = new Error("RoleMenu mapping not found");
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};
