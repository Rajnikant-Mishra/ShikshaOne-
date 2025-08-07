import Joi from "joi";

export const createUserSchema = Joi.object({
  role: Joi.number().integer().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),

  username: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username can be at most 100 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email address",
    "string.empty": "Email is required",
  }),

  //   password: Joi.string()
  //     .pattern(
  //       new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{4,}$")
  //     )
  //     .required()
  //     .messages({
  //       "string.pattern.base":
  //         "Password must be at least 4 characters, include uppercase, lowercase, number, and special character",
  //       "string.empty": "Password is required",
  //     }),
  password: Joi.string().min(4).required().messages({
    "string.empty": `"password" is required`,
    "string.min": `"password" must be at least 4 characters`,
  }),

  gender: Joi.string().valid("Male", "Female", "Other").optional().messages({
    "any.only": "Gender must be Male, Female, or Other",
  }),

  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit number",
    }),

  // Optional fields if you're including these later
  grade_id: Joi.number().integer().optional(),
  section: Joi.string().optional(),
  dob: Joi.date().optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});
