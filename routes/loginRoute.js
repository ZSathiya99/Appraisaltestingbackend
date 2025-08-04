const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "appraisal_backend";

// POST /api/employee-login
router.post("/employee-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const employee = await Employee.findOne({ email: email.trim() });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!employee.password) {
      return res.status(400).json({ message: "Password not set for this employee" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: employee._id, email: employee.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

res.status(200).json({
  message: "Login successful",
  token,
  employee: {
    id: employee._id,
    email: employee.email,
    fullName: employee.fullName,
    department: employee.department,
    designation: employee.designation,
    phone: employee.phone,
    address: employee.address,
    joiningDate: employee.joiningDate,
    salary: employee.salary,
    managerEmail: employee.managerEmail,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  },
});

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
