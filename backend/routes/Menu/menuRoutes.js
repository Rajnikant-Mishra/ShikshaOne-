import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createMenuSchema, updateMenuSchema } from "../../validations/menu/menu.validation.js";
import { MenuController } from "../../controllers/Menu/menuController.js";

const router = express.Router();

router.post("/", validateRequest(createMenuSchema), MenuController.create);
router.get("/", MenuController.getAll);
router.get("/:id", MenuController.getById);
router.put("/:id", MenuController.update);
router.delete("/:id", MenuController.remove);

export default router;
