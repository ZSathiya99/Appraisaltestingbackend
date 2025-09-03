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

    const employee = req.userId;
    const userEmail = req.user.email;
    
    console.log(employee, userEmail);

    const loggedInEmployee = await Employee.findOne({ email: userEmail });

    if (!loggedInEmployee) {
      return res.status(404).json({ message: "User not found in Employee records" });
    }

    // Validate if user is HOD or Dean
    const designation = loggedInEmployee.designation;
    let filter = { designation: { $ne: "HOD" } };

    if (designation === "HOD") {
      filter.department = loggedInEmployee.department; // Only employees in HOD's department
    } else if (designation === "Dean") {
      // Dean can see all employees - no filter
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

// all forms
exports.getAllTeachingRecords = async (req, res) => {
  try {
    const records = await TeachingRecord.find();

    const updatedRecords = records.map(record => {
      const r = record.toObject();

      let earnedTotal = 0;
      let maxTotal = 0;

      for (const key in maxPointsMap) {
        if (r[key] && typeof r[key] === 'object' && r[key] !== null) {
          r[key].maxMarks = maxPointsMap[key];

          if (typeof r[key].marks === 'number') {
            earnedTotal += r[key].marks;
          }
          maxTotal += maxPointsMap[key]; 
        }
      }

      r.totalMarks = {
        earned: earnedTotal,
        outOf: maxTotal
      };

      return r;
    });

    res.status(200).json(updatedRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching teaching records', error: err.message });
  }
};

