
const express = require("express");
const router = express.Router();
const { getEmployeeStats, getEmployees, markFormSubmitted, getFilteredTeachingRecords , getFile} = require("../controllers/dashboardController");
const authenticate = require("../middleware/authenticate");

router.get("/total_employees",authenticate, getEmployeeStats);
router.get("/get_employees", authenticate,getEmployees);
router.put("/submit/:employeeId", markFormSubmitted);
router.get("/getForms", authenticate, getFilteredTeachingRecords)
router.get('/file/:filename', getFile);



module.exports = router;