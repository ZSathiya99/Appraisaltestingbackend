const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");
const cleanBody = require("../utils/cleanBody");

// Q1: Accreditation Activities
exports.calculateActivitiesMarks = async (req, res) => {
  try {
    const { facultyName, roles, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    let rolesArray = roles;
    if (typeof roles === "string") {
      try {
        rolesArray = JSON.parse(roles);
      } catch {
        rolesArray = roles.includes(",")
          ? roles.split(",").map(r => r.trim())
          : [roles];
      }
    }
    if (!Array.isArray(rolesArray)) rolesArray = [];

    const accFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(accFiles)];

    const pointsMap = {
      InstitutionalCoordinator: 5,
      DepartmentCoordinator: 3,
      FileIncharge: 2,
    };

    let totalMarks = 0;
    rolesArray.forEach((role) => {
      if (pointsMap[role]) {
        totalMarks += pointsMap[role];
      }
    });

    const maxPass = pointsDistribution[designation]?.service?.activities ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.activities = {
      value: rolesArray,
      marks: finalMarks,
      activitiesFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Accreditation / Activities",
      roles: rolesArray,
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (error) {
    console.error("Error calculating accreditation activities marks:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Q2: Branding
exports.calculateBrandingMarks = async (req, res) => {
  try {
    const { facultyName, branding, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    const BrandingFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(BrandingFiles)];

    const isYes = branding?.toLowerCase() === "yes";
    const marks = isYes ? 5 : 0;
    const maxmark = pointsDistribution[designation]?.service?.Branding ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.branding = {
      value: branding,
      marks: finalMarks,
      brandingFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Branding",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error calculating branding marks:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Q3: Memebership
exports.calculateMembershipMarks = async (req, res) => {
  try {
    const { facultyName, membership, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    const MembershipFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(MembershipFiles)];

    const isYes = membership?.toLowerCase() === "yes";
    const marks = isYes ? 4 : 1;
    const maxmark = pointsDistribution[designation]?.service?.Membership ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.membership = {
      value: membership,
      marks: finalMarks,
      membershipFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Membership",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error calculating membership marks:", err);
    return res.status(500).json({ error: err.message });
  }
};


// Q4: Co-curricular
exports.calculateCocurricularMarks = async (req, res) => {
  try {
    const { facultyName, cocurricular, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    let cocurricularData = cocurricular;
    if (!cocurricularData && req.body["cocurricular "]) {
      cocurricularData = req.body["cocurricular "];
    }
    if (typeof cocurricularData === "string") {
      try {
        cocurricularData = JSON.parse(cocurricularData);
      } catch {
        cocurricularData = {};
      }
    }

    const { role, count } = cocurricularData || {};
    const projectCount = Number(count) || 0;

    const FundFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(FundFiles)];

    let marksPerProject = 0;
    if (role === "ResourcePerson") marksPerProject = 2;
    else if (role === "Events") marksPerProject = 1;

    const totalMarks = projectCount * marksPerProject;
    const maxPass = pointsDistribution[designation]?.service?.External ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.external = {
      value: "Co-curricular",
      marks: finalMarks,
      externalFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Co-curricular",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error calculating co-curricular marks:", err);
    return res.status(500).json({ error: err.message });
  }
};


//Q5: Assistance
exports.calculateAssistanceMarks = async (req, res) => {
  try {
    const { facultyName, assistance, employeeId, designation: bodyDesignation } = cleanBody(req.body);
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    const AssistanceFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(AssistanceFiles)];

    const isYes = assistance?.toLowerCase() === "yes";
    const marks = isYes ? 5 : 0;
    const maxmark = pointsDistribution[designation]?.service?.Administration ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.administration = {
      value: "Assistance",
      marks: finalMarks,
      administrationFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Administration/Assistance",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error calculating assistance marks:", err);
    return res.status(500).json({ error: err.message });
  }
};



//Q6: Training
exports.calculateTrainingMarks = async (req, res) => {
  try {
    const { facultyName, training, employeeId, designation: bodyDesignation } = cleanBody(req.body);
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    const trainingFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(trainingFiles)];

    let marks = 0;
    if (training === "3 days & above") marks = 5;
    else if (training === "2 days") marks = 3;
    else if (training === "1 day") marks = 1;

    const maxmark = pointsDistribution[designation]?.service?.Training ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    record.training = {
      value: training,
      marks: finalMarks,
      trainingFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Training / Workshop",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error calculating training marks:", err);
    return res.status(500).json({ error: err.message });
  }
};

