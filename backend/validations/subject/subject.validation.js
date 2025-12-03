import Joi from "joi";

export const createSubjectSchema = Joi.object({
  subject_name: Joi.string()
    .pattern(/^[a-zA-Z0-9 _-]+$/)
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "Special characters like @ # ~ ` are not allowed.",
      "string.empty": "Class name is required",
      "string.min": "Class name must have at least 2 characters",
      "string.max": "Class name must be less than or equal to 100 characters",
    }),
  status: Joi.string().valid("Active", "Inactive").default("Active"),
});

export const updateSubjectSchema = Joi.object({
  subject_name: Joi.string().trim().min(2).max(100).optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});
