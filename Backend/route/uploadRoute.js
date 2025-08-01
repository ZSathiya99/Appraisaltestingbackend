const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// File storage config
const upload = multer({ dest: "uploads/" });

router.post("/upload-users", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(sheet);

    for (const user of users) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          email: user.email,
          password: hashedPassword,
          username: user.username || "",
        });
      }
    }

    res.json({ message: "Users uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
