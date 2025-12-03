import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Op } from "sequelize";

import User from "../../models/User/userModel.js";
import Role from "../../models/Role/roleModel.js";
import RoleMenu from "../../models/configuration/role_menuModel.js";
import { createUserSchema } from "../../validations/users/userValidation.js";

User.belongsTo(Role, { foreignKey: "role_id" }); // Ensure association is declared

// helper function: generate user_id
const generateUserId = async (rolePrefix) => {
  const lastUser = await User.findOne({
    where: { student_id: { [Op.like]: `${rolePrefix}-%` } },
    order: [["id", "DESC"]],
  });

  let nextNumber = 1;
  if (lastUser) {
    const lastNumber = parseInt(lastUser.student_id.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  return `${rolePrefix}-${String(nextNumber).padStart(5, "0")}`;
};

export const createUser = async (req, res) => {
  try {
    // 1. Validate input
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let { username, role_id, email, password } = value;
    email = email.toLowerCase();

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // 3. Check role
    const roleData = await Role.findByPk(role_id);
    if (!roleData) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    let student_id = null;
    // 4. Generate user_id prefix based on role
    if (roleData.role_name.toLowerCase() === "student") {
      student_id = await generateUserId("ST");
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const newUser = await User.create({
      role_id,
      student_id,
      username,
      email,
      password: hashedPassword,
      status: "active",
    });

    // 7. Respond with safe user data
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        student_id: newUser.student_id,
        username: newUser.username,
        email: newUser.email,
        role_id: newUser.role_id,
        status: newUser.status,
      },
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

    // 1️⃣ Support login with either email or user_id
    if (!email && !student_id) {
      return res.status(400).json({ error: "Email or User ID is required" });
    }

    const user = await User.findOne({
      where: email ? { email: email.toLowerCase() } : { student_id },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Fetch role details
    const roleDetails = await Role.findByPk(user.role_id);

    // 5️⃣ Fetch role menus (if using RoleMenu)
    const menus = await RoleMenu.findAll({ where: { role_id: user.role_id } });

    // 6️⃣ Respond with user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        student_id: user.student_id,
        email: user.email,
        role: roleDetails ? roleDetails.role_name : null,
        status: user.status,
      },
      roleDetails,
      menus,
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Logout User
export const logoutUser = async (req, res) => {
  try {
    // Invalidate token on client side; server typically doesn’t store it
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause for User
    const userWhere = search
      ? {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { student_id: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Build where clause for Role (optional filter by role)
    const roleWhere = role ? { role_name: { [Op.like]: `%${role}%` } } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: Role,
          where: roleWhere,
          attributes: ["id", "role_name"],
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
      users: users.map((u) => ({
        id: u.id,
        student_id: u.student_id,
        username: u.username,
        email: u.email,
        role_id: u.role_id,
        role_name: u.Role ? u.Role.role_name : null,
        status: u.status,
        created_at: u.created_at,
        updated_at: u.updated_at,
      })),
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Update User
export const updateUser = async (req, res) => {
  try {
    const { role, username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updatedRows] = await User.update(
      {
        role,
        username,
        email,
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

// // Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Get User Profile from token
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
