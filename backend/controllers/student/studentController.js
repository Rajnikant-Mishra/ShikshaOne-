import Student from "../../models/student/studentModel.js";
import { generateRollNumber } from "../../utils/generateRollNumber.js";
import { Op } from "sequelize";

export const createStudent = async (req, res) => {
  try {
    const { user_id, email, grade_id, section, gender, status } = req.body;

    //validate input
    if (!user_id || !email || !grade_id || !section || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    //validate email format
    const existingStudent = await Student.findOne({ where: { user_id } });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    //roll number
    const roll_number = await generateRollNumber(grade_id, section);

    const student = await Student.create({
      user_id,
      email,
      grade_id,
      section,
      gender,
      status,
      roll_number,
    });
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error creating student", error });
  }
};
