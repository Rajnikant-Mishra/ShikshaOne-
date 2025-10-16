import express from "express";
import {
  createStudent,
  getAllStudents,
  deleteStudent,
} from "../../controllers/student/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/all", getAllStudents);
router.delete("/:id", deleteStudent);

export default router;
