import express from "express";
import controller from "../../controllers/student/student.controller.js";
import upload from "../../middlewares/student.image.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {createStudentSchema} from "../../validations/student/student.validation.js";

const router = express.Router();

router.post(
  "/",
  upload.single("student_image"),
  validateRequest(createStudentSchema),
  controller.create
);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", upload.single("student_image"), controller.update);
router.delete("/:id", controller.delete);

export default router;
