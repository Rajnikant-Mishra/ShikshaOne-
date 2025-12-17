import Menu from "../Menu/menu.model.js";
import { Op } from "sequelize";

export const MenuService = {
  //create menu section
  async create(data) {
    // Check for duplicates (title OR link)
    const existing = await Menu.findOne({
      where: {
        [Op.or]: [{ title: data.title }, { link: data.link }],
      },
    });

    if (existing) {
      const duplicateField = existing.title === data.title ? "title" : "link";
      const message = `A menu with this ${duplicateField} already exists`;
      const error = new Error(message);
      error.status = 400;
      throw error;
    }

    return await Menu.create(data);
  },

  async findAll() {
    return await Menu.findAll({
      order: [["created_at", "DESC"]],
    });
  },

  async findById(id) {
    return await Menu.findByPk(id);
  },

  async update(id, data) {
    const menu = await Menu.findByPk(id);
    if (!menu) return null;

    // 🔍 Check duplicate on update (exclude same record)
    if (data.title || data.link) {
      const existing = await Menu.findOne({
        where: {
          [Op.or]: [
            data.title ? { title: data.title } : {},
            data.link ? { link: data.link } : {},
          ],
          id: { [Op.ne]: id },
        },
      });

      if (existing) {
        const duplicateField = existing.title === data.title ? "title" : "link";
        const message = `Another menu with this ${duplicateField} already exists`;
        const error = new Error(message);
        error.status = 400;
        throw error;
      }
    }

    await menu.update(data);
    return menu;
  },

  async remove(id) {
    const deleted = await Menu.destroy({ where: { id } });
    return deleted > 0;
  },
};
