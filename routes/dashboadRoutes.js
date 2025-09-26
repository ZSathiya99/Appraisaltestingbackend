
const express = require("express");
const router = express.Router();
const { getEmployeeStats, getEmployees, markFormSubmitted, getFilteredTeachingRecords , getFile, getEmployeeForms} = require("../controllers/dashboardController");
const authenticate = require("../middleware/authenticate");

router.get("/total_employees",authenticate, getEmployeeStats);
router.get("/get_employees", authenticate,getEmployees);
router.put("/submit/:employeeId", markFormSubmitted);
router.get("/getForms", authenticate, getFilteredTeachingRecords);
router.get('/file/:filename', getFile);
router.get("/tableData", authenticate, getEmployeeForms);
router.put("/approvehod/:recordId",authenticate,approveByHOD);
router.put("/approvedean/:recordId",authenticate,approveByDean);


module.exports = router;