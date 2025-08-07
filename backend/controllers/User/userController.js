import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Op } from "sequelize";

import User from "../../models/User/userModel.js";
import Role from "../../models/Role/roleModel.js";
import RoleMenu from "../../models/configuration/role_menuModel.js";
import { generateRollNumber } from "../../utils/generateRollNumber.js";
import { createUserSchema } from "../../utils/userValidation.js";

User.belongsTo(Role, { foreignKey: "role" }); // Ensure association is declared

// Create User
export const createUser = async (req, res) => {
  try {
    // 1. Validate Input
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      role,
      username,
      email,
      password,
      mobile_number,
      gender,
      dob,
      grade_id,
      section,
      status,
    } = value;

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // 3. Get Role Data
    const roleData = await Role.findByPk(role);
    if (!roleData) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    let student_id = null;
    let roll_number = null;

    // 4. For student, generate student_id and roll_number
    if (roleData.role_name.toLowerCase() === "student") {
      const lastStudent = await User.findOne({
        where: { role },
        order: [["id", "DESC"]],
      });

      const lastId = lastStudent?.student_id?.match(/STD(\d+)/)?.[1] || 0;
      student_id = `STD${String(parseInt(lastId) + 1).padStart(3, "0")}`;
      roll_number = await generateRollNumber(grade_id, section);
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Format DOB safely
    const formattedDob = dob ? new Date(dob).toISOString().slice(0, 10) : null;

    // 7. Create user
    const newUser = await User.create({
      role,
      username,
      email,
      password: hashedPassword,
      mobile_number,
      gender,
      dob: formattedDob,
      grade_id,
      section,
      student_id,
      roll_number,
      status: status || "active",
    });

    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
      student_id: newUser.student_id,
      roll_number: newUser.roll_number,
      role_name: roleData.role_name,
    });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, student_id, password } = req.body;

    // Support login with either student_id or email
    const user = await User.findOne({
      where: email ? { email } : student_id ? { student_id } : null,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect Password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const roleDetails = await Role.findByPk(user.role);
    const menus = await RoleMenu.findAll({ where: { role_id: user.role } });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        student_id: user.student_id,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
      roleDetails,
      menus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Invalidate token on client side; server typically doesn’t store it
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const userWhere = {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile_number: { [Op.like]: `%${search}%` } },
        { roll_number: { [Op.like]: `%${search}%` } },
        { student_id: { [Op.like]: `%${search}%` } },
        { section: { [Op.like]: `%${search}%` } },
        { gender: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } },
      ],
    };

    const { count, rows: users } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: Role,
          where: {
            role_name: { [Op.like]: "student" }, // Case-insensitive match
          },
          attributes: ["role_name"],
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (err) {
    console.error("Error fetching student users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { role, username, email, phone, status, password, confirm_password } =
      req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updatedRows] = await User.update(
      {
        role,
        username,
        email,
        phone,
        status,
        password: hashedPassword,
        confirm_password: hashedPassword,
      },
      { where: { id: req.params.id } }
    );

    if (updatedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile from token
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
