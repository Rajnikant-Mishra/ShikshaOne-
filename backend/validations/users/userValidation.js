import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(4).required().messages({
    "string.empty": `"password" is required`,
    "string.min": `"password" must be at least 4 characters`,
  }),

  role_id: Joi.number().integer().required(),
  status: Joi.string().valid("active", "inactive").optional(),
}).unknown(true);
