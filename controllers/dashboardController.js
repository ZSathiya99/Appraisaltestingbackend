const  Employee = require("../models/Employee");

exports.getTotalEmployees = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: "Active" });
    res.json({ totalEmployees });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total employees" });
  }
};
