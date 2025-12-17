
import express from "express";
import studentController from "../Student/student.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {createStudentSchema} from "../../validations/student/student.validation.js";
import { studentUpload } from "../../middlewares/student.image.js";

const router = express.Router();

router.post("/", studentUpload, validateRequest(createStudentSchema), studentController.create);
router.get("/", studentController.getAll);
router.get("/:id", studentController.getOne);
router.put("/:id", studentController.update);
router.delete("/:id", studentController.delete);

export default router;
