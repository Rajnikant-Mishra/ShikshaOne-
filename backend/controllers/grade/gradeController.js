import Grade from "../../models/grade/gradeModel.js";
import { Op } from "sequelize";

//create a new grade
export const createGrade = async (req, res) => {
  try {
    const { grade_name } = req.body;

    //validate input
    const existingGrade = await Grade.findOne({ where: { grade_name } });

    if (existingGrade) {
      return res.status(400).json({
        message: "Grade name already exists, please use a different name.",
      });
    }

    const grade = await Grade.create({ grade_name });
    res.status(201).json({ message: "grade created successfully", grade });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating grade", error: err.message });
  }
};

//get all grades
export const getAllGrades = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { grade_name: { [Op.like]: `%${search}%` } },
        { created_at: { [Op.like]: `%${search}%` } },
        { updated_at: { [Op.like]: `%${search}%` } },
      ],
    };

    const { rows, count } = await Grade.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.status(201).json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching grades", error: err.message });
  }
};

//get all not pagination and saerch
export const getAll = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.status(200).json(grades);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching grades", error: err.message });
  }
};
