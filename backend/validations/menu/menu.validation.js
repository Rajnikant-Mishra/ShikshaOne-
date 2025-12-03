import Joi from "joi";

export const createMenuSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "any.required": "Title is required",
  }),
  link: Joi.string().required().messages({
    // "string.uri": "Link must be a valid URL",
    "any.required": "Link is required",
  }),
  image: Joi.string().required().messages({
    // "string.uri": "Image must be a valid URL",
    "any.required": "Image is required",
  }),
  updated_by: Joi.string().optional().allow(null, ""),
});

export const updateMenuSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional(),
  link: Joi.string().uri().optional(),
  image: Joi.string().uri().optional(),
  updated_by: Joi.string().optional().allow(null, ""),
});
