import express from "express";
import {createStudent } from "../../controllers/student/studentController.js";

const router = express.Router();


router.post("/student", createStudent);

export default router;