import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "../../validations/teacher/teacher.validation.js";
import teacherController from "../Teacher/teacher.controller.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createTeacherSchema),
  teacherController.create
);

router.get("/", teacherController.getAll);

router.get("/:id", teacherController.getById);

router.put(
  "/:id",
  validateRequest(updateTeacherSchema),
  teacherController.update
);

router.delete("/:id", teacherController.delete);

export default router;
