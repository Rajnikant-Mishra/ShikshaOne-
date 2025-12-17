import studentRepository from "../Student/student.repository.js";
import studentClassRepository from "../Class/class.repository.js";
import Student from "../Student/student.model.js";

class StudentService {
  // Generate student ID: STU202500001
  async generateStudentId() {
    const year = new Date().getFullYear();

    const lastStudent = await Student.findOne({
      order: [["id", "DESC"]],
    });

    let counter = lastStudent ? lastStudent.id + 1 : 1;
    const padded = String(counter).padStart(5, "0");

    return `STU${year}${padded}`;
  }

  // Generate roll number per class & section
  async generateRollNumber(class_id, section) {
    const students = await studentRepository.findByClassAndSection(
      class_id,
      section
    );
    return students.length + 1;
  }

  // student create
  async createStudent(data) {
    const classExists = await studentClassRepository.findById(data.class_id);

    if (!classExists) {
      throw new Error("Invalid class_id. class does not exist.");
    }

    const student_id = await this.generateStudentId();
    const roll_number = await this.generateRollNumber(
      data.class_id,
      data.section
    );

    return await studentRepository.create({
      ...data,
      student_id,
      roll_number,
    });
  }



  async getStudents({ page, limit, search }) {
    const offset = (page - 1) * limit;

    const { rows, count } = await studentRepository.findAll({
      offset,
      limit,
      search,
    });

    return {
      students: rows,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    };
  }

  async getStudentById(id) {
    return await studentRepository.findById(id);
  }

  async updateStudent(id, data) {
    return await studentRepository.update(id, data);
  }

  async deleteStudent(id) {
    return await studentRepository.delete(id);
  }
}

export default new StudentService();
