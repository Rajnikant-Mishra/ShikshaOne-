import express from "express";
import controller from "../../Modules/Class/class.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createStudentClassSchema,
  updateStudentClassSchema,
} from "../../validations/class/studentClass.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", validateRequest(createStudentClassSchema), controller.create);
router.put(
  "/:id",
  validateRequest(updateStudentClassSchema),
  controller.update
);
router.delete("/:id", controller.delete);

export default router;
