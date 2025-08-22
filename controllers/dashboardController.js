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


exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 10;  
    const skip = (page - 1) * limit;

    const employees = await Employee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  

    const totalEmployees = await Employee.countDocuments();

    res.json({
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      pageSize: employees.length,
      employees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching employees" });
  }
};