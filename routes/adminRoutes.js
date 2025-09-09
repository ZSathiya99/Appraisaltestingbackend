
const express = require("express");
const router = express.Router();
const {postQuestions, getAnswers } = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");

router.post("/question",postQuestions);
router.get("/joinAnswer/:recordId",getAnswers);



module.exports = router;