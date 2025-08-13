const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

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
  calculateSeedFund


} = require("../controllers/researchController");

router.post("/scie/:designation", upload.any(), calculateSciePaper);
router.post("/scopus/:designation", upload.any(), calculateScopusPaper);
router.post("/aicte/:designation", upload.any(), calculateAictePaper);
router.post("/scopusBook/:designation",upload.any(),calculateScopusBook);
router.post("/IndexedBook/:designation",upload.any(),calculateIndexedBook);
router.post("/Patent/:designation", upload.any(), calculatePatentMarks);
router.post("/hindex/:designation",upload.any(),calculatehIndex);
router.post("/Iindex/:designation",upload.any(),calculateIIndex);
router.post("/Citation/:designation",upload.any(),calculateCitation);
router.post("/consultancy/:designation",upload.any(),calculateConsultancy);
router.post("/Collabrative/:designation",upload.any(),calculateForeignMarks);
router.post("/SeedFund/:designation",upload.any(),calculateSeedFund);


module.exports = router;
