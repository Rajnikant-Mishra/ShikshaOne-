import express from "express";
import {createGrade,  getAllGrades, getAll } from "../../controllers/grade/gradeController.js";


const router = express.Router();

router.post("/grade", createGrade);   
router.get("/grades",  getAllGrades);
router.get("/grades/all", getAll );


export default router;