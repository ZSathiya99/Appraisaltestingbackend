const { mergeFormPDFs } = require("../utils/pdfUtils");
const TeachingRecord = require("../models/TeachingRecord");

const PDFMerger = require("pdf-merger-js").default;

// === Full Fields by Category ===
const teachingFields = [
  "teachingAssignment",
  "passPercentage",
  "feedback",
  "innovativeApproach",
  "visitingFaculty",
  "studentProject",
  "fdpFunding",
  "innovationProject",
  "fdp",
  "industry",
  "tutorMeeting",
  "academicPosition",
];

const researchFields = [
  "sciePaper",
  "scopusPaper",
  "aictePaper",
  "scopusBook",
  "indexBook",
  "hIndex",
  "iIndex",
  "citation",
  "consultancy",
  "collabrative",
  "seedFund",
  "patent",
  "fundedProject",
  "researchScholars",
];

const serviceFields = [
  "activities",
  "branding",
  "membership",
  "external",
  "administration",
  "training",
];

// Helper to map fields to section objects
const mapToSections = (fields) => fields.map((f) => ({ key: f, label: f }));

// === Teaching Form ===
exports.generateTeachingReportPDF = async (req, res) => {
  try {
    const employeeId = req.userId;
    console.log(employeeId);
    const record = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");
    if (!record) return res.status(404).json({ message: "Teaching record not found" });

    const sections = mapToSections(teachingFields);
    const fileKeys = ["teachingAssignment",
      "passPercentage",
      "feedback",
      "innovativeApproach",
      "visitingFaculty",
      "studentProject",
      "fdpFunding",
      "innovationProject",
      "fdp",
      "industry",
      "tutorMeeting",
      "academicPosition"];

    const pdfBuffer = await mergeFormPDFs(record, "Faculty Members Performance Appraisal Form", sections, fileKeys);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="teaching-report-${employeeId}.pdf"`);
    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Error generating Teaching PDF", error: err.message });
  }
};

// === Research Form ===
exports.generateResearchReportPDF = async (req, res) => {
  try {
    const employeeId = req.userId;
    const record = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");
    if (!record) return res.status(404).json({ message: "Research record not found" });

    const sections = mapToSections(researchFields);
    const fileKeys = ["sciePaper",
      "scopusPaper",
      "aictePaper",
      "scopusBook",
      "indexBook",
      "hIndex",
      "iIndex",
      "citation",
      "consultancy",
      "collabrative",
      "seedFund",
      "patent",
      "fundedProject",
      "researchScholars"];

    const pdfBuffer = await mergeFormPDFs(record, "Faculty Members Performance Appraisal Form", sections, fileKeys);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="research-report-${employeeId}.pdf"`);
    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Error generating Research PDF", error: err.message });
  }
};

// === Service Form ===
exports.generateServiceReportPDF = async (req, res) => {
  try {
    const employeeId = req.userId;
    const record = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");
    if (!record) return res.status(404).json({ message: "Service record not found" });

    const sections = mapToSections(serviceFields);
    const fileKeys = ["activities",
      "branding",
      "membership",
      "external",
      "administration",
      "training"];

    const pdfBuffer = await mergeFormPDFs(record, "Faculty Members Performance Appraisal Form", sections, fileKeys);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="service-report-${employeeId}.pdf"`);
    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Error generating Service PDF", error: err.message });
  }
};

// === Consolidated Form ===
exports.generateConsolidatedReportPDF = async (req, res) => {
  try {
    const employeeId = req.userId;
    const merger = new PDFMerger();

    const teachingRecord = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");
    const researchRecord = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");
    const serviceRecord = await TeachingRecord.findOne({ employee: employeeId }).populate("employee");

    if (teachingRecord) {
      const pdfBuffer = await mergeFormPDFs(teachingRecord, "Teaching Record", mapToSections(teachingFields), ["teachingAssignment",
        "passPercentage",
        "feedback",
        "innovativeApproach",
        "visitingFaculty",
        "studentProject",
        "fdpFunding",
        "innovationProject",
        "fdp",
        "industry",
        "tutorMeeting",
        "academicPosition"]);
      await merger.add(Uint8Array.from(pdfBuffer));
    }

    if (researchRecord) {
      const pdfBuffer = await mergeFormPDFs(researchRecord, "Research Record", mapToSections(researchFields), ["sciePaper",
        "scopusPaper",
        "aictePaper",
        "scopusBook",
        "indexBook",
        "hIndex",
        "iIndex",
        "citation",
        "consultancy",
        "collabrative",
        "seedFund",
        "patent",
        "fundedProject",
        "researchScholars"]);
      await merger.add(Uint8Array.from(pdfBuffer));
    }

    if (serviceRecord) {
      const pdfBuffer = await mergeFormPDFs(serviceRecord, "Service Record", mapToSections(serviceFields), ["activities",
        "branding",
        "membership",
        "external",
        "administration",
        "training"]);
      await merger.add(Uint8Array.from(pdfBuffer));
    }

    const consolidatedBuffer = await merger.saveAsBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="consolidated-report-${employeeId}.pdf"`);
    res.end(consolidatedBuffer);
  } catch (err) {
    res.status(500).json({ message: "Error generating consolidated PDF", error: err.message });
  }
};
