const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

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
  calculateRoleMarks
} = require("../controllers/teachingController");

router.get('/points/:designation', getPointsByDesignation);
router.post("/teaching", upload.array("Teachingfiles"), calculateTeachingMarks);
router.post("/passPercentage", calculatePassPercentageMarks);
router.post("/feedback", calculateStudentFeedbackMarks);
router.post(
  "/innovativeApproach",
  upload.array("innovativeFiles"),
  calculateInnovativeApporachMarks
);
router.post(
  "/guestLecture",
  upload.array("guestLecturefiles"),
  calculateGuestlectureMarks
);
router.post(
  "/fdpFunding",
  upload.array("fdpfundingfiles"),
  calculateFdpfundingMarks
);
router.post(
  "/highlevelCompetition",
  upload.array("highlevelCompetitionFiles"),
  calculateHighlevelCompetionMarks
);
router.post(
  "/fdpPrograms",
  upload.array("FdpprogramFiles"),
  calculateFdpProgramMarks
);

router.post(
  "/industryInvolvement",
  upload.array("IndustryFiles"),
  calculateIndustryInvolvementMarks
);
router.post(
  "/tutorwardMeeting",
  upload.array("ValueAdditionFiles"),
  calculateTutorWardMarks
);

router.post(
  "/academicRoles",
  upload.array("files"),
  calculateRoleMarks
);
module.exports = router;
