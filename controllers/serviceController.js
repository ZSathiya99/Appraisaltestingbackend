const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");

// Q1: Accreditation Activities
exports.calculateActivitiesMarks = async (req, res) => {
  try {
    const { facultyName, roles } = req.body; 
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const accFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(accFiles)];

    const pointsMap = {
      InstitutionalCoordinator: 5,
      DepartmentCoordinator: 3,
      FileIncharge: 2
    };

    let totalMarks = 0;
    roles?.forEach(role => {
      if (pointsMap[role]) {
        totalMarks += pointsMap[role];
      }
    });

    const maxPass = pointsDistribution[designation]?.research?.accreditation ?? totalMarks;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.activities = {
      value: "activities",
      marks: finalMarks,
      accreditationFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "AccreditationActivities",
      finalMarks
    });

  } catch (error) {
    console.error("Error calculating accreditation activities marks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Q2: Branding
exports.calculateActivitiesMarks = async (req, res) => {
  try {
    const { facultyName, roles } = req.body; 
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const accFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(accFiles)];

    const pointsMap = {
      InstitutionalCoordinator: 5,
      DepartmentCoordinator: 3,
      FileIncharge: 2
    };

    let totalMarks = 0;
    roles?.forEach(role => {
      if (pointsMap[role]) {
        totalMarks += pointsMap[role];
      }
    });

    const maxPass = pointsDistribution[designation]?.research?.accreditation ?? totalMarks;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.activities = {
      value: "activities",
      marks: finalMarks,
      accreditationFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "AccreditationActivities",
      finalMarks
    });

  } catch (error) {
    console.error("Error calculating accreditation activities marks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
