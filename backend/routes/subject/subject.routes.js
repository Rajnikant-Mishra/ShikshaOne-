import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../../validations/subject/subject.validation.js";
import subjectController from "../../controllers/subject/subject.controller.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createSubjectSchema),
  subjectController.create
);
router.get("/", subjectController.getAll);
// router.get("/:id", subjectController.getById);
router.put(
  "/:id",
  validateRequest(updateSubjectSchema),
  subjectController.update
);
router.delete("/:id", subjectController.delete);

export default router;
