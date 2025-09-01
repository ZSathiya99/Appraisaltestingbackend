const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-employees", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const employees = XLSX.utils.sheet_to_json(sheet);

    let created = 0;
    let skipped = [];

    for (const emp of employees) {
      const existing = await Employee.findOne({ email: emp.email });

      if (!existing) {
        if (!emp.password) {
          skipped.push(`${emp.email} (missing password)`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(emp.password, 10);

        await Employee.create({
          employee_id : emp.employee_id,
          email: emp.email.trim(),
          password: hashedPassword,
          fullName: emp.fullName || emp.name,
          department: emp.department,
          designation: emp.designation,
          joiningDate: emp.joiningDate ,
          phone_number: emp.phoneNumber,
        });

        created++;
      } else {
        skipped.push(`${emp.email} (already exists)`);
      }
    }

    fs.unlinkSync(path.resolve(req.file.path)); // Clean up

    res.json({
      message: `✅ Upload completed. Created ${created} employee(s).`,
      skipped: skipped.length > 0 ? skipped : undefined,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
