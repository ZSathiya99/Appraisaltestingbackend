
const express = require("express");
const router = express.Router();
const { getEmployeeStats, getEmployees, markFormSubmitted } = require("../controllers/dashboardController");

router.get("/total_employees", getEmployeeStats);
router.get("/get_employees", getEmployees);
router.put("/submit/:employeeId", markFormSubmitted);


module.exports = router;