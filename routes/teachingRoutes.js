const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { generateFacultyReportPDF } = require('../controllers/pdfController');


const {
  calculateTeachingMarks,
  calculatePassPercentageMarks,
  calculateStudentFeedbackMarks,
  calculateInnovativeApporachMarks,
  calculateGuestlectureMarks,
  calculateFdpfundingMarks,
  calculateHighlevelCompetionMarks,
  calculateFdpProgramMarks,
  calculateIndustryInvolvementMarks,
  calculateTutorWardMarks,
  getPointsByDesignation,
  calculateRoleMarks,
  deleteImage,
  getTeachingRecord,
  calculateStudentProjectMarks,
  generateFacultyReportPDF
} = require("../controllers/teachingController");

router.get('/points/:designation', getPointsByDesignation);
router.post("/teaching/:designation", upload.any(), calculateTeachingMarks);
router.post("/passPercentage/:designation", calculatePassPercentageMarks);
router.post("/feedback/:designation", calculateStudentFeedbackMarks);
router.post(
  "/innovativeApproach/:designation",
  upload.any(),
  calculateInnovativeApporachMarks
);
router.post(
  "/guestLecture/:designation",
  upload.any(),
  calculateGuestlectureMarks
);
router.post(
  "/fdpFunding/:designation",
  upload.any(),
  calculateFdpfundingMarks
);
router.post(
  "/highlevelCompetition/:designation",
  upload.any(),
  calculateHighlevelCompetionMarks
);
router.post(
  "/fdpPrograms/:designation",
  upload.any(),
  calculateFdpProgramMarks
);

router.post(
  "/industryInvolvement/:designation",
  upload.any(),
  calculateIndustryInvolvementMarks
);
router.post(
  "/tutorwardMeeting/:designation",
  upload.any(),
  calculateTutorWardMarks
);

router.post(
  "/academicRoles/:designation",
  upload.any(),
  calculateRoleMarks
);

router.post(
  "/project/:designation",
  upload.any(),
  calculateStudentProjectMarks
);

router.post(
  "/teachingrecord",
  getTeachingRecord
);



router.delete(
  "/deleteImage/:filename",
  deleteImage
);


router.post('/report_pdf', generateFacultyReportPDF);


module.exports = router;
