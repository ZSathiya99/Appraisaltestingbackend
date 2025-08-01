// routes/upload.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const File = require("../models/File");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, path, mimetype, size } = req.file;

    const newFile = new File({
      filename,
      filepath: path,
      mimetype,
      size,
    });

    await newFile.save();

    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (err) {
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

module.exports = router;
