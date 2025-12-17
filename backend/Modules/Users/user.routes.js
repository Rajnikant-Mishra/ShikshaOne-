// import express from "express";
// import {
//   createUser,
//   loginUser,
//   logoutUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getUserProfile,
// } from "../../Modules/Users/user.controller.js";
// import { authenticateToken } from "../../middlewares/verifyToken.js";

// const router = express.Router();

// // Public routes
// router.post("/", createUser);
// router.post("/login", loginUser);

// // Protected routes
// router.post("/logout", logoutUser);
// router.get("/all", getAllUsers);
// router.get("/users/:id", authenticateToken, getUserById);
// router.put("/users/:id", authenticateToken, updateUser);
// router.delete("/:id", deleteUser);

// // Authenticated user profile route (based on token)
// router.get("/profile", authenticateToken, getUserProfile);

// export default router;


import express from "express";
import upload from "../../middlewares/uploadProfile.js";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../../Modules/Users/user.controller.js";
import { authenticateToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

// CREATE USER WITH PROFILE IMAGE
router.post("/", upload.single("user_profile"), createUser);

router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser);

router.get("/all",  getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);

// UPDATE USER PROFILE IMAGE
router.put(
  "/users/:id",
  authenticateToken,
  upload.single("user_profile"),
  updateUser
);

router.delete("/:id", authenticateToken, deleteUser);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
