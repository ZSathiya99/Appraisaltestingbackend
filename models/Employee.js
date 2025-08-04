const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ Add this
  fullName: String,
  department: String,
  designation: String,
  phone: String,
  address: String,
  joiningDate: Date,
  salary: Number,
  managerEmail: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
