import Student from "../../models/student/studentModel.js";
import User from "../../models/User/userModel.js";
import { generateRollNumber } from "../../validations/generateRollNumber.js";
import { Op } from "sequelize";

export const createStudent = async (req, res) => {
  try {
    const {
      user_id,
      dob,
      aadhaar_card,
      mobile_number,
      grades,
      section,
      gender,
      status,
    } = req.body;

    // 1. Validate required fields
    if (!user_id || !dob || !grades || !section || !gender || !mobile_number) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // 2. Check if student for this user already exists
    const existingStudent = await Student.findOne({ where: { user_id } });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student already exists for this user" });
    }

    // 3. Generate roll_number automatically
    const roll_number = await generateRollNumber(grades, section);

    // 4. Create student
    const student = await Student.create({
      user_id,
      roll_number,
      dob,
      aadhaar_card,
      mobile_number,
      grades,
      section,
      gender,
      status: status || "Active",
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all students with pagination and search
export const getAllStudents = async (req, res) => {
  try {
    // Pagination & search params
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build search condition
    const searchCondition = {
      [Op.or]: [
        { grades: { [Op.like]: `%${search}%` } },
        { section: { [Op.like]: `%${search}%` } },
        { roll_number: { [Op.like]: `%${search}%` } },
        { mobile_number: { [Op.like]: `%${search}%` } },
        { aadhaar_card: { [Op.like]: `%${search}%` } },
      ],
    };

    // Fetch students with associated user info
    const { count, rows: students } = await Student.findAndCountAll({
      where: searchCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "status"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      totalStudents: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

//delete stduent
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.destroy();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student" });
  }
};