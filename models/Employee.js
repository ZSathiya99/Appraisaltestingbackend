const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  fullName: String,
  department: String,
  designation: String,
  phone: String,
  address: String,
  joiningDate: Date,
  salary: Number,
  managerEmail: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

module.exports = mongoose.model("Employee", employeeSchema);
