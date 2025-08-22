
const express = require("express");
const router = express.Router();
const { getTotalEmployees } = require("../controllers/dashboardController");

router.get("/total_employees", getTotalEmployees);

module.exports = router;