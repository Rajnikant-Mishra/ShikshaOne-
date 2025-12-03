import Student from "../../models/student/student.model.js";
import { Op } from "sequelize";

class StudentRepository {
  
  async create(data) {
    return Student.create(data);
  }

  async findAll({ page = 1, limit = 10, search = "", student_class, status }) {
    const offset = (page - 1) * limit;

    let where = {};

    // Search filter
    if (search) {
      where = {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { student_id: { [Op.like]: `%${search}%` } },
          { roll_number: { [Op.like]: `%${search}%` } },
          { parent_mobile: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    if (student_class) where.student_class = student_class;
    if (status) where.status = status;

    const { rows, count } = await Student.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { rows, count };
  }

  async findById(id) {
    return Student.findByPk(id);
  }

  async update(id, data) {
    return Student.update(data, { where: { id } });
  }

  async delete(id) {
    return Student.destroy({ where: { id } });
  }
}

export default new StudentRepository();
