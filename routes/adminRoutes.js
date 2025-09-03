
const express = require("express");
const router = express.Router();
const {postQuestions } = require("../controllers/admin");
const authenticate = require("../middleware/authenticate");

router.get("/question",postQuestions);



module.exports = router;