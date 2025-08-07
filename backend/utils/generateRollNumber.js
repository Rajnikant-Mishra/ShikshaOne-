import Student from "../models/student/studentModel.js";


export const generateRollNumber = async (grade_id, section) => {
  const count = await Student.count({ where: { grade_id, section } });
  const nextNumber = count + 1;
  const padded = String(nextNumber).padStart(3, "0"); // e.g., 001
  return `G${grade_id}-S${section}-${padded}`; // Example: G2-SA-001
};