const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticate = require("../middleware/authenticate");

const {
  calculateActivitiesMarks,
  calculateBrandingMarks,
  calculateMembershipMarks,
  calculateCocurricularMarks,
  calculateAssistanceMarks,
  calculateTrainingMarks

} = require("../controllers/serviceController");

router.post("/activities/:designation", upload.any(),authenticate, calculateActivitiesMarks);
router.post("/branding/:designation", upload.any(), authenticate,calculateBrandingMarks);
router.post("/membership/:designation", upload.any(),authenticate, calculateMembershipMarks);
router.post("/cocurricular/:designation", upload.any(),authenticate, calculateCocurricularMarks);
router.post("/assistance/:designation", upload.any(),authenticate, calculateAssistanceMarks);
router.post("/training/:designation", upload.any(),authenticate, calculateTrainingMarks);

module.exports = router;