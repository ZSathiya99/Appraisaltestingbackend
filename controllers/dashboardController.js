const  Employee = require("../models/Employee");
const TeachingRecord = require("../models/TeachingRecord")
const maxPointsMap = require('../utils/prePoints');
const path = require('path');

exports.getEmployeeStats = async (req, res) => {
  try {
    const { department } = req.user;

    const staff = await Employee.find({
      department,
      designation: { $ne: "HOD" },
      status: "Active"
    });

    const submittedForms = staff.filter(emp => emp.formStatus === "Submitted").length;

    const formSubmissionPercentage =
      staff.length > 0 ? ((submittedForms / staff.length) * 100).toFixed(2) : 0;

    const professorCount = staff.filter(emp => emp.designation === "Professor").length;
    const associateProfessorCount = staff.filter(emp => emp.designation === "Associate Professor").length;
    const assistantProfessorCount = staff.filter(emp => emp.designation === "Assistant Professor").length;
    const hodCount = await Employee.countDocuments({ department, designation: "HOD" });

    res.json({
      department,
      totalEmployees: staff.length,
      professorCount,
      associateProfessorCount,
      assistantProfessorCount,
      hodCount,
      submittedForms,
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

exports.getFile = async (req, res) => {
  const filename = req.params.filename;
  const uploadFolder = path.join(__dirname, '..', 'uploads'); // assuming uploads folder is one level above controllers
  const filePath = path.join(uploadFolder, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
  });
};