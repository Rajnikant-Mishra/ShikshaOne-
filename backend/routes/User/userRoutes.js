// import express from 'express';
// import {createUser,loginUser, logoutUser, getAllUsers,getUserById, updateUser, deleteUser} from '../../controllers/User/userController.js';
// import   {authenticateToken } from '../../middleware/verifyToken.js';

// const router = express.Router();

// router.post('/users', createUser);
// router.post('/users/login', loginUser);
// router.post('/users/logout',logoutUser);
// router.get('/users',  getAllUsers);
// router.get('/users/:id', getUserById);
// router.put('/users/:id',  updateUser);
// router.delete('/users/:id',  deleteUser);

// export default router;

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
router.post("/users", createUser);
router.post("/users/login", loginUser);

// Protected routes
router.post("/users/logout",logoutUser);
router.get("/users", getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

// Authenticated user profile route (based on token)
router.get("/profile", authenticateToken, getUserProfile);

export default router;
