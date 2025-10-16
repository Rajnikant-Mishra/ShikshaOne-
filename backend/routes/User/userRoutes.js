import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../../controllers/User/userController.js";
import { authenticateToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/", createUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", logoutUser);
router.get("/all", getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/:id", deleteUser);

// Authenticated user profile route (based on token)
router.get("/profile", authenticateToken, getUserProfile);

export default router;
