import teacherRepository from "../Teacher/teacher.repository.js";

class TeacherService {
  //   async createTeacher(data) {
  //     const existing = await teacherRepository.findByEmail(data.email);
  //     if (existing) {
  //       throw new Error("Teacher with this email already exists");
  //     }

  //     return teacherRepository.create(data);
  //   }

  async generateEmpId() {
    const year = new Date().getFullYear();

    const lastTeacher = await teacherRepository.findLastEmpIdByYear(year);

    let nextNumber = 1;

    if (lastTeacher?.emp_id) {
      const parts = lastTeacher.emp_id.split("-");
      nextNumber = parseInt(parts[2], 10) + 1;
    }

    return `EMP-${year}-${String(nextNumber).padStart(3, "0")}`;
  }

  async createTeacher(data) {
    const existing = await teacherRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Teacher with this email already exists");
    }

    const emp_id = await this.generateEmpId();

    return teacherRepository.create({
      ...data,
      emp_id,
    });
  }

  async getTeacherById(id) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) throw new Error("Teacher not found");
    return teacher;
  }

  async getAll(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || "";

    return await teacherRepository.findAllWithFilters({
      page,
      limit,
      search,
    });
  }

  async updateTeacher(id, data) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) throw new Error("Teacher not found");

    await teacherRepository.update(id, data);
    return this.getTeacherById(id);
  }

  async deleteTeacher(id) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) throw new Error("Teacher not found");

    return teacherRepository.delete(id);
  }
}

export default new TeacherService();
