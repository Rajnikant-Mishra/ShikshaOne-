import Subject from "../../models/subject/subject.model.js";

import { Op } from "sequelize";

class SubjectRepository {
  create(data) {
    return Subject.create(data);
  }

  findByName(subject_name) {
    return Subject.findOne({ where: { subject_name } });
  }

  findAllWithFilters({ page, limit, search }) {
    const offset = (page - 1) * limit;

    return Subject.findAndCountAll({
      where: {
        subject_name: { [Op.like]: `%${search}%` },
      },
      offset,
      limit,
      order: [["id", "DESC"]],
    });
  }

  findById(id) {
    return Subject.findByPk(id);
  }

  update(id, body) {
    return Subject.update(body, { where: { id } });
  }

  delete(id) {
    return Subject.destroy({ where: { id } });
  }
}

export default new SubjectRepository();

