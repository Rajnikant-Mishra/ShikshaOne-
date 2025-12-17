// src/routes/configuration/roleMenu.route.js
import express from "express";
import { RoleMenuController } from "../Menupermission/menupermission.controller.js";
import { assignMenuSchema, deleteRoleMenuSchema } from "../../validations/menu/roleMenu.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = express.Router();

// Assign menu → roles
router.post("/assign", validateRequest(assignMenuSchema), RoleMenuController.assignMenu);

// Get all mappings
router.get("/role-menu-all", RoleMenuController.getAllRoleMenu);

// Get menus for specific role
router.get("/:role_id", RoleMenuController.getMenusByRole);

// Delete a mapping
router.delete("/assign/:id",validateRequest(deleteRoleMenuSchema, "params"), RoleMenuController.deleteRoleMenu );

export default router;
