
const express = require("express");
const router = express.Router();
const { getEmployeeStats, getEmployees, markFormSubmitted } = require("../controllers/dashboardController");
const authenticate = require("../middleware/authenticate");

router.get("/total_employees",authenticate, getEmployeeStats);
router.get("/get_employees", authenticate,getEmployees);
router.put("/submit/:employeeId", markFormSubmitted);



module.exports = router;