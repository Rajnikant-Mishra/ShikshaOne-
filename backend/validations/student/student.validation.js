import Joi from "joi";

// Schema for creating a student
export const createStudentSchema = Joi.object({
  // Names
  // ================== Names ==================
  first_name: Joi.string().min(2).max(50).required().messages({
    "any.required": "First name is required",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must be less than 50 characters",
  }),

  middle_name: Joi.string().min(2).max(50).optional().allow(""),

  last_name: Joi.string().min(2).max(50).required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must be less than 50 characters",
  }),

  // ================== Personal ==================
  dob: Joi.date().required().messages({
    "any.required": "Date of birth is required",
    "date.base": "Date of birth must be a valid date",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.required": "Gender is required",
    "any.only": "Gender must be Male, Female, or Other",
  }),

  // ================== Contact ==================
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be exactly 10 digits",
  }),

  alt_phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Alternate phone must be 10 digits",
    }),

  email: Joi.string().email().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),

  // ================== Academic ==================
  class_id: Joi.number().integer().required().messages({
    "any.required": "Class is required",
    "number.base": "Class must be a valid number",
  }),

  section: Joi.string().optional().allow(""),

  // ================== Parents ==================
  father_name: Joi.string().optional().allow(""),
  mother_name: Joi.string().optional().allow(""),

  guardian_type: Joi.string()
    .valid("Father", "Mother", "Guardian")
    .optional()
    .messages({
      "any.only": "Guardian type must be Father, Mother, or Guardian",
    }),

  // ================== Address ==================
  address_line1: Joi.string().optional().allow(""),
  address_line2: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  state: Joi.string().optional().allow(""),
  postal_code: Joi.string().optional().allow(""),
  country: Joi.string().optional().allow(""),

  // ================== Extra ==================
  tags: Joi.array().items(Joi.string()).optional(),
  photo: Joi.string().optional().allow(""),
  birth_certificate: Joi.string().optional().allow(""),
  id_proof: Joi.string().optional().allow(""),
});

// Schema for updating a student
export const updateStudentSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  class_name: Joi.string().optional(),
  section: Joi.string().optional().allow(""),
});
