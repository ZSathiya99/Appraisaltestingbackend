const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticate = require("../middleware/authenticate");

const {
  calculateSciePaper,
  calculateScopusPaper,
  calculateAictePaper,
  calculateScopusBook,
  calculateIndexedBook,
  calculatePatentMarks,
  calculatehIndex,
  calculateIIndex,
  calculateCitation,
  calculateConsultancy,
  calculateForeignMarks,
  calculateSeedFund,
  calculateFundedProjectMarks,
  calculateResearchScholarMarks


} = require("../controllers/researchController");

router.post("/scie/:designation", upload.any(), authenticate,calculateSciePaper);
router.post("/scopus/:designation", upload.any(), authenticate,calculateScopusPaper);
router.post("/aicte/:designation", upload.any(), authenticate,calculateAictePaper);
router.post("/scopusBook/:designation",upload.any(),authenticate,calculateScopusBook);
router.post("/IndexedBook/:designation",upload.any(),authenticate,calculateIndexedBook);
router.post("/Patent/:designation", upload.any(), authenticate,calculatePatentMarks);
router.post("/hindex/:designation",upload.any(),authenticate,calculatehIndex);
router.post("/Iindex/:designation",upload.any(),authenticate,calculateIIndex);
router.post("/Citation/:designation",upload.any(),authenticate,calculateCitation);
router.post("/consultancy/:designation",upload.any(),authenticate,calculateConsultancy);
router.post("/Collabrative/:designation",upload.any(),authenticate,calculateForeignMarks);
router.post("/SeedFund/:designation",upload.any(),authenticate,calculateSeedFund);
router.post("/Fund/:designation",upload.any(),authenticate,calculateFundedProjectMarks);
router.post("/researchScholar/:designation",upload.any(),authenticate,calculateResearchScholarMarks);

module.exports = router;
