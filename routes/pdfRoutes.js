const express = require("express");
const router = express.Router();
const {
  generateTeachingReportPDF,
  generateResearchReportPDF,
  generateServiceReportPDF,
  generateConsolidatedReportPDF
} = require("../controllers/pdfController");

const authenticate = require("../middleware/authenticate");

router.post("/pdf/teaching",authenticate, generateTeachingReportPDF);
router.post("/pdf/research", generateResearchReportPDF);
router.post("/pdf/service", generateServiceReportPDF);
router.post("/pdf/consolidated", generateConsolidatedReportPDF);

module.exports = router;
