import repo from "../../repositories/student/student.repository.js";
import Student from "../../models/student/student.model.js";

class StudentService {

  async generateStudentID() {
    const year = new Date().getFullYear();
    const count = await Student.count();
    const newNo = String(count + 1).padStart(3, "0");
    return `STU-${year}-${newNo}`;
  }

  async generateRollNumber(studentClass) {
    const count = await Student.count({
      where: { student_class: studentClass },
    });
    const newRoll = String(count + 1).padStart(3, "0");
    return `${studentClass}-${newRoll}`;
  }

  async create(data) {
    const student_id = await this.generateStudentID();
    const roll_number = await this.generateRollNumber(data.student_class);

    const finalData = { ...data, student_id, roll_number };
    return repo.create(finalData);
  }

  async getAll(query) {
    const filters = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search || "",
      student_class: query.student_class || undefined,
      status: query.status || undefined,
    };

    return repo.findAll(filters);
  }

  async getById(id) {
    const student = await repo.findById(id);
    if (!student) throw new Error("Student not found");
    return student;
  }

  async update(id, data) {
    const student = await this.getById(id);

    delete data.student_id;
    delete data.roll_number;

    if (data.student_class && data.student_class !== student.student_class) {
      data.roll_number = await this.generateRollNumber(data.student_class);
    }

    return repo.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    return repo.delete(id);
  }
}

export default new StudentService();
