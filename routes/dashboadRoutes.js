
const express = require("express");
const router = express.Router();
const { getEmployeeStats } = require("../controllers/dashboardController");

router.get("/total_employees", getEmployeeStats);

module.exports = router;