const  Employee = require("../models/Employee");
const TeachingRecord = require("../models/TeachingRecord")

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

     const submittedForms = await TeachingRecord.countDocuments({
      isFormSubmitted: true
    });

    const formSubmissionPercentage =
      totalEmployees > 0 ? ((submittedForms / totalEmployees) * 100).toFixed(2) : 0;

    res.json({
      totalEmployees,
      professorCount,
      associateProfessorCount,
      assistantProfessorCount,
      formSubmissionPercentage: `${formSubmissionPercentage}%`
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

exports.markFormSubmitted = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { formStatus: 'Submitted' },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Form marked as submitted successfully",
      employee: updatedEmployee
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({ message: "Error marking form as submitted" });
  }
};