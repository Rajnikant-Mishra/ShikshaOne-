import Student from "../Student/student.model.js";
import { Op } from "sequelize";

class StudentRepository {
  async create(data) {
    return await Student.create(data);
  }

  // async findAll() {
  //   return await Student.findAll();
  // }

  async findAll({ offset, limit, search }) {
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { student_id: { [Op.like]: `%${search}%` } },
            { roll_number: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    return await Student.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id) {
    return await Student.findByPk(id);
  }

  async findByClassAndSection(class_id, section) {
    return await Student.findAll({
      where: { class_id, section },
    });
  }

  async update(id, data) {
    return await Student.update(data, { where: { id } });
  }

  async delete(id) {
    return await Student.destroy({ where: { id } });
  }
}

export default new StudentRepository();
