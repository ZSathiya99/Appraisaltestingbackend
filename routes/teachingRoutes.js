const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { generateTeachingReportPDF } = require('../controllers/pdfController');
const authenticate = require("../middleware/authenticate");


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
} = require("../controllers/teachingController");

router.get('/points/:designation', getPointsByDesignation);
router.post("/teaching/:designation", upload.any(), authenticate, calculateTeachingMarks);
router.post("/passPercentage/:designation",authenticate, calculatePassPercentageMarks);
router.post("/feedback/:designation",authenticate, calculateStudentFeedbackMarks);
router.post(
  "/innovativeApproach/:designation",
  upload.any(),authenticate,
  calculateInnovativeApporachMarks
);
router.post(
  "/guestLecture/:designation",
  upload.any(),authenticate,
  calculateGuestlectureMarks
);
router.post(
  "/fdpFunding/:designation",
  upload.any(),authenticate,
  calculateFdpfundingMarks
);
router.post(
  "/highlevelCompetition/:designation",
  upload.any(),authenticate,
  calculateHighlevelCompetionMarks
);
router.post(
  "/fdpPrograms/:designation",
  upload.any(),authenticate,
  calculateFdpProgramMarks
);

router.post(
  "/industryInvolvement/:designation",
  upload.any(),authenticate,
  calculateIndustryInvolvementMarks
);
router.post(
  "/tutorwardMeeting/:designation",
  upload.any(),authenticate,
  calculateTutorWardMarks
);

router.post(
  "/academicRoles/:designation",
  upload.any(),authenticate,
  calculateRoleMarks
);

router.post(
  "/project/:designation",
  upload.any(),authenticate,
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


router.post('/report_pdf', generateTeachingReportPDF);


module.exports = router;
