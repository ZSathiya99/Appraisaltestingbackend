
const express = require("express");
const router = express.Router();
const { getEmployeeStats, getEmployees } = require("../controllers/dashboardController");

router.get("/total_employees", getEmployeeStats);
router.get("/get_employees", getEmployees);

module.exports = router;