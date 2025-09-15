const  Employee = require("../models/Employee");
const TeachingRecord = require("../models/TeachingRecord")
const maxPointsMap = require('../utils/prePoints');

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

    const loggedInEmployee = await Employee.findById(req.userId);
    let filter = { status: "Active", designation: { $ne: "HOD" } };

    if (loggedInEmployee.designation === "HOD") {
      filter.department = loggedInEmployee.department;
    } else if (loggedInEmployee.designation === "Dean") {
      filter = { status: "Active" };
    } else {
      filter = null; 
    }

    let filteredStats = {};
    if (filter) {
      const filteredEmployees = await Employee.find(filter).select("_id designation");
      const employeeIds = filteredEmployees.map(e => e._id);

      const teachingRecords = await TeachingRecord.find({ employee: { $in: employeeIds } });

      const verifiedCount = teachingRecords.filter(r => r.approvalStatus === "Approved").length;
      const notVerifiedCount = teachingRecords.length - verifiedCount;

      filteredStats = {
        totalEmployees: filteredEmployees.length,
        verifiedCount,
        notVerifiedCount
      };
    }

    res.json({
      overall: {
        totalEmployees,
        professorCount,
        associateProfessorCount,
        assistantProfessorCount,
        formSubmissionPercentage: `${formSubmissionPercentage}%`
      },
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

    const employee = req.userId;
    const userEmail = req.user.email;
    
    console.log(employee, userEmail);

    const loggedInEmployee = await Employee.findOne({ email: userEmail });

    if (!loggedInEmployee) {
      return res.status(404).json({ message: "User not found in Employee records" });
    }

    const designation = loggedInEmployee.designation;
    let filter = { designation: { $ne: "HOD" } };

    if (designation === "HOD") {
      filter.department = loggedInEmployee.department; 
    } else if (designation === "Dean") {

    } else {
      return res.status(403).json({ message: "Access denied. Only HOD or Dean can view this data." });
    }

    const employees = await Employee.find(filter)
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

// get the form based on the login
exports.getFilteredTeachingRecords = async (req, res) => {
  try {

    const loggedInEmployee = await Employee.findById(req.userId);
    if (!loggedInEmployee) {
      return res.status(404).json({ message: "User not found in Employee records" });
    }

    const designation = loggedInEmployee.designation;
    let filter = { designation: { $ne: "HOD" } };

    if (designation === "HOD") {
      filter.department = loggedInEmployee.department;
    } else if (designation === "Dean") {
      filter = {}; 
    } else {
      return res.status(403).json({ message: "Access denied. Only HOD or Dean can view this data." });
    }

    const filteredEmployees = await Employee.find(filter).select("_id");
    const employeeIds = filteredEmployees.map(e => e._id);

    const records = await TeachingRecord.find({ employee: { $in: employeeIds } })
      .populate("employee")
      .sort({ createdAt: -1 })
      .lean();

    const verified = records.filter(r => r.approvalStatus === "Approved");
    const notVerified = records.filter(r => r.approvalStatus !== "Approved"); // or === "pending"

    res.status(200).json({
      verified,
      notVerified
    });
  } catch (err) {
    console.error("Error fetching filtered teaching records:", err);
    res.status(500).json({ message: "Error fetching filtered teaching records", error: err.message });
  }
};

