import StudentClass from "../../models/class/studentClass.model.js";
import { Op } from "sequelize";

class StudentClassRepository {
  async create(data) {
    return StudentClass.create(data);
  }

  async findByName(class_name) {
    return StudentClass.findOne({
      where: { class_name },
    });
  }

  async findById(id) {
    return StudentClass.findOne({ where: { id } });
  }

  // async findAll(){
  //   return StudentClass.findAll({order: [["id", "DESC"]]});
  // }

  async findAllWithFilters({ page, limit, search }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where.class_name = { [Op.like]: `%${search}%` };
    }

    return StudentClass.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
  }

  async update(id, data) {
    return StudentClass.update(data, { where: { id } });
  }

  async delete(id) {
    return StudentClass.destroy({ where: { id } });
  }
}

export default new StudentClassRepository();
