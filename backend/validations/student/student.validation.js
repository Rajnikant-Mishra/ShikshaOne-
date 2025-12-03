// validations/student.validation.js
import Joi from "joi";

export const createStudentSchema = Joi.object({
  first_name: Joi.string().max(100).required().messages({
    "string.empty": "First name is required",
  }),

  last_name: Joi.string().max(100).required().messages({
    "string.empty": "Last name is required",
  }),

  date_of_birth: Joi.date().required().messages({
    "date.base": "Date of birth must be a valid date",
    "any.required": "Date of birth is required",
  }),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required()
    .messages({
      "any.only": "Gender must be male, female or other",
    }),

  admission_date: Joi.date().required(),

  student_class: Joi.string().max(50).required(),

  parent_name: Joi.string().max(150).required(),

  parent_email: Joi.string().email().required(),

  parent_mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

  address: Joi.string().allow(null, ""),
  // student_image: Joi.string().optional().allow(null, ""),
  student_image: Joi.any().optional()

});
