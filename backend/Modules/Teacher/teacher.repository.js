import Teacher from "../Teacher/teacher.model.js";
import { Op } from "sequelize";

class TeacherRepository {
  async create(data) {
    return Teacher.create(data);
  }

  async findLastEmpIdByYear(year) {
    return Teacher.findOne({
      where: {
        emp_id: {
          [Op.like]: `EMP-${year}-%`,
        },
      },
      order: [["id", "DESC"]],
    });
  }

  async findById(id) {
    return Teacher.findOne({ where: { id } });
  }

  async findByEmail(email) {
    return Teacher.findOne({ where: { email } });
  }

  async findByEmpId(emp_id) {
    return Teacher.findOne({ where: { emp_id } });
  }

  async findAllWithFilters({ page, limit, search }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { emp_id: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    return Teacher.findAndCountAll({
      where,
      offset,
      limit,
      order: [["id", "DESC"]],
    });
  }

  async update(id, data) {
    return Teacher.update(data, { where: { id } });
  }

  async delete(id) {
    return Teacher.destroy({ where: { id } });
  }
}

export default new TeacherRepository();
