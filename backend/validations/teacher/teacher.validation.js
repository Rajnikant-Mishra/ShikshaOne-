import Joi from "joi";

export const createTeacherSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z .]+$/)
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base":
        "Only alphabets, space and dot are allowed in name",
      "string.empty": "Teacher name is required",
      "string.min": "Teacher name must have at least 3 characters",
      "string.max":
        "Teacher name must be less than or equal to 100 characters",
    }),

  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
      "string.empty": "Phone number is required",
    }),

  joining_date: Joi.date()
    .required()
    .messages({
      "date.base": "Joining date must be a valid date",
      "any.required": "Joining date is required",
    }),

  // classes: Joi.array()
  //   .items(
  //     Joi.string()
  //       .pattern(/^[a-zA-Z0-9 _-]+$/)
  //       .trim()
  //       .min(1)
  //       .max(50)
  //   )
  //   .min(1)
  //   .required()
  //   .messages({
  //     "array.base": "Classes must be an array",
  //     "array.min": "At least one class must be selected",
  //     "any.required": "Classes are required",
  //   }),

  // subjects: Joi.array()
  //   .items(
  //     Joi.string()
  //       .pattern(/^[a-zA-Z0-9 _-]+$/)
  //       .trim()
  //       .min(1)
  //       .max(50)
  //   )
  //   .min(1)
  //   .required()
  //   .messages({
  //     "array.base": "Subjects must be an array",
  //     "array.min": "At least one subject must be selected",
  //     "any.required": "Subjects are required",
  //   }),

  classes: Joi.array()
  .items(
    Joi.number()
      .integer()
      .positive()
      .required()
  )
  .min(1)
  .required()
  .messages({
    "array.base": "Classes must be an array",
    "array.min": "At least one class must be selected",
    "number.base": "Class ID must be a number",
    "number.integer": "Class ID must be an integer",
    "number.positive": "Class ID must be a positive number",
    "any.required": "Classes are required",
  }),

subjects: Joi.array()
  .items(
    Joi.number()
      .integer()
      .positive()
      .required()
  )
  .min(1)
  .required()
  .messages({
    "array.base": "Subjects must be an array",
    "array.min": "At least one subject must be selected",
    "number.base": "Subject ID must be a number",
    "number.integer": "Subject ID must be an integer",
    "number.positive": "Subject ID must be a positive number",
    "any.required": "Subjects are required",
  }),


  status: Joi.string()
    .valid("Active", "Inactive")
    .default("Active"),
});




export const updateTeacherSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z .]+$/)
    .trim()
    .min(3)
    .max(100)
    .optional(),

  email: Joi.string()
    .email()
    .trim()
    .optional(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  joining_date: Joi.date()
    .optional(),

  classes: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .min(1)
    .optional()
    .messages({
      "array.base": "Classes must be an array",
      "array.min": "At least one class must be selected",
      "number.base": "Class ID must be a number",
      "number.integer": "Class ID must be an integer",
      "number.positive": "Class ID must be a positive number",
    }),

  subjects: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .min(1)
    .optional()
    .messages({
      "array.base": "Subjects must be an array",
      "array.min": "At least one subject must be selected",
      "number.base": "Subject ID must be a number",
      "number.integer": "Subject ID must be an integer",
      "number.positive": "Subject ID must be a positive number",
    }),

  profile_image: Joi.string()
    .trim()
    .max(255)
    .optional(),

  status: Joi.string()
    .valid("Active", "Inactive")
    .optional(),
})
.min(1); // ✅ ensures at least one field is sent for update
