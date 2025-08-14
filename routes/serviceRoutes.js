const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  calculateActivitiesMarks,
  calculateBrandingMarks,
  calculateMembershipMarks,
  calculateCocurricularMarks,
  calculateAssistanceMarks,
  calculateTrainingMarks

} = require("../controllers/serviceController");

router.post("/activities/:designation", upload.any(), calculateActivitiesMarks);
router.post("/branding/:designation", upload.any(), calculateBrandingMarks);
router.post("/membership/:designation", upload.any(), calculateMembershipMarks);
router.post("/cocurricular/:designation", upload.any(), calculateCocurricularMarks);
router.post("/assistance/:designation", upload.any(), calculateAssistanceMarks);
router.post("/training/:designation", upload.any(), calculateTrainingMarks);

module.exports = router;