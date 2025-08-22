const  Employee = require("../models/Employee");

exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: "Active" });

    const professorCount = await Employee.countDocuments({
      designation: "Professor",
      status: "Active"
    });

    const associateProfessorCount = await Employee.countDocuments({
      designation: "Associate Professor",
      status: "Active"
    });

    const assistantProfessorCount = await Employee.countDocuments({
      designation: "Assistant Professor",
      status: "Active"
    });

    res.json({
      totalEmployees,
      professorCount,
      associateProfessorCount,
      assistantProfessorCount
    });
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    res.status(500).json({ message: "Error fetching employee statistics" });
  }
};