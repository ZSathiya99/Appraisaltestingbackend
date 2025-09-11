
const express = require("express");
const router = express.Router();
const {postQuestions, getAnswers, getTeachingRecordById } = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");

router.post("/question",postQuestions);
// router.get("/joinAnswer/:recordId",getAnswers);
router.get("/joinAnswer/:recordId",getTeachingRecordById);




module.exports = router;