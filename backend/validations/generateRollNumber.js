import Student from "../models/student/studentModel.js";


export const generateRollNumber = async (grades, section) => {
  // Format: GRD-SEC-0001 (Example: 10-A-0001)
  const lastStudent = await Student.findOne({
    where: {
      grades,
      section,
    },
    order: [["id", "DESC"]],
  });

  let nextNumber = 1;
  if (lastStudent) {
    const lastRoll = lastStudent.roll_number.split("-")[2]; // get numeric part
    nextNumber = parseInt(lastRoll) + 1;
  }

  return `${grades}-${section}-${String(nextNumber).padStart(4, "0")}`;
};