const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticate = require('../middleware/authenticate');

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
  saveTeachingRecord
} = require("../controllers/teachingController");

router.get('/points/:designation', getPointsByDesignation);
router.post("/teaching/:designation", upload.array("Teachingfiles"), calculateTeachingMarks);
router.post("/passPercentage/:designation", calculatePassPercentageMarks);
router.post("/feedback/:designation", calculateStudentFeedbackMarks);
router.post(
  "/innovativeApproach/:designation",
  upload.array("innovativeFiles"),
  calculateInnovativeApporachMarks
);
router.post(
  "/guestLecture/:designation",
  upload.array("guestLecturefiles"),
  calculateGuestlectureMarks
);
router.post(
  "/fdpFunding/:designation",
  upload.array("fdpfundingfiles"),
  calculateFdpfundingMarks
);
router.post(
  "/highlevelCompetition/:designation",
  upload.array("highlevelCompetitionFiles"),
  calculateHighlevelCompetionMarks
);
router.post(
  "/fdpPrograms/:designation",
  upload.array("FdpprogramFiles"),
  calculateFdpProgramMarks
);

router.post(
  "/industryInvolvement/:designation",
  upload.array("IndustryFiles"),
  calculateIndustryInvolvementMarks
);
router.post(
  "/tutorwardMeeting/:designation",
  upload.array("ValueAdditionFiles"),
  calculateTutorWardMarks
);

router.post(
  "/academicRoles/:designation",
  upload.array("files"),
  calculateRoleMarks
);

router.post(
  '/teachingrecord/save',
  upload.fields([
    { name: 'teachingFiles' },
    { name: 'feedbackFiles' },
    { name: 'innovativeApproachFiles' },
    { name: 'visitingFacultyFiles' },
    { name: 'fdpFundingFiles' },
    { name: 'innovationProjectFiles' },
    { name: 'fdpFiles' },
    { name: 'industryFiles' },
    { name: 'tutorMeetingFiles' },
    { name: 'academicPositionFiles' },
  ]),
  saveTeachingRecord
);

module.exports = router;
