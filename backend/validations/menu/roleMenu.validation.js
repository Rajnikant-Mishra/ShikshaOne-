// src/validations/configuration/roleMenu.validation.js
import Joi from "joi";

export const assignMenuSchema = Joi.object({
  menu_id: Joi.number().integer().required().messages({
    "number.base": "menu_id must be a number",
    "any.required": "menu_id is required",
  }),
  role_ids: Joi.array()
    .items(Joi.number().integer().required())
    .min(1)
    .required()
    .messages({
      "array.base": "role_ids must be an array of role IDs",
      "array.min": "At least one role_id is required",
    }),
});

export const deleteRoleMenuSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.base": "id must be a valid number",
    "any.required": "id is required",
  }),
});
