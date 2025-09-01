const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");
const cleanBody = require("../utils/cleanBody");

// Q1: Accreditation Activities
exports.calculateActivitiesMarks = async (req, res) => {
  try {
    const { facultyName } = req.body; 
    let { roles } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: "Designation missing in token" });
    }

    if (typeof roles === "string") {
      try {
        roles = JSON.parse(roles); 
      } catch {
        roles = roles.includes(",")
          ? roles.split(",").map(r => r.trim()) 
          : [roles]; 
      }
    }
    if (!Array.isArray(roles)) roles = [];

    const accFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(accFiles)];

    const pointsMap = {
      InstitutionalCoordinator: 5,
      DepartmentCoordinator: 3,
      FileIncharge: 2,
    };

    let totalMarks = 0;
    roles.forEach((role) => {
      if (pointsMap[role]) {
        totalMarks += pointsMap[role];
      }
    });


    const maxPass = pointsDistribution[designation]?.service?.activities ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
      record = new teaching({ facultyName, designation, employee });
    }

    record.activities = {
      value: "activities",
      marks: finalMarks,
      activitiesFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "AccreditationActivities",
      roles,
      finalMarks,
    });
  } catch (error) {
    console.error("Error calculating accreditation activities marks:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Q2: Branding
exports.calculateBrandingMarks = async (req, res) => {
  console.log(req.body)
  try {
    const body = cleanBody(req.body);
    const { designation } = req.params;
    const { facultyName, branding } = body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    
    const BrandingFiles = req.files?.map((file) => file.path) || [];
    const isYes = branding?.toLowerCase() === 'yes';
    const marks = isYes ? 5 : 0;
    const uniqueFiles = [...new Set(BrandingFiles)];

    const maxmark = pointsDistribution[designation]?.service?.Branding ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
      record = new teaching({ facultyName, designation, employee });
    }

    record.branding = {
      value: branding,
      marks: finalMarks,
      brandingFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      finalMarks,
      files: uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q3: Memebership
exports.calculateMembershipMarks = async (req, res) => {
  try {

    const body = cleanBody(req.body);
    const { designation } = req.params;
    const { facultyName, membership } = body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    
    const MembershipFiles = req.files?.map((file) => file.path) || [];
    const isYes = membership?.toLowerCase() === 'yes';
    const marks = isYes ? 4 : 1;
    const uniqueFiles = [...new Set(MembershipFiles)];

    const maxmark = pointsDistribution[designation]?.service?.Membership ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
      record = new teaching({ facultyName, designation, employee });
    }

    record.membership = {
      value: membership,
      marks: finalMarks,
      membershipFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      finalMarks,
      files: uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q4: Co-curricular
exports.calculateCocurricularMarks = async (req, res) => {
  console.log(req.body)
  try {
    let { facultyName, cocurricular } = req.body;

    if (!cocurricular && req.body["cocurricular "]) {
      cocurricular = req.body["cocurricular "];
    }

    if (typeof cocurricular === "string") {
      cocurricular = JSON.parse(cocurricular);
    }

    const { role, count } = cocurricular || {};
    const { designation } = req.params;
    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const projectCount = Number(count) || 0;

    const FundFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(FundFiles)];
    
    let marksPerProject = 0;
    if (role === "ResourcePerson") marksPerProject = 2;
    else if (role === "Events") marksPerProject = 1;

    const totalMarks = projectCount * marksPerProject;

    const maxPass = pointsDistribution[designation]?.service?.External ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
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
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q5: Assistance
exports.calculateAssistanceMarks = async (req, res) => {
  try {

    const body = cleanBody(req.body);
    const { designation } = req.params;
    const { facultyName, assistance } = body;


    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    
    const AssistanceFiles = req.files?.map((file) => file.path) || [];
    const isYes = assistance?.toLowerCase() === 'yes';
    const marks = isYes ? 5 : 0;
    const uniqueFiles = [...new Set(AssistanceFiles)];

    const maxmark = pointsDistribution[designation]?.service?.Administration ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
      record = new teaching({ facultyName, designation, employee });
    }

    record.administration = {
      value: "Assistance",
      marks: finalMarks,
      administrationFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      finalMarks,
      files: uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


//Q6: Training
exports.calculateTrainingMarks = async (req, res) => {
  console.log(req.body)
  try {
    const data = cleanBody(req.body);

    const { designation } = req.params;

    const facultyName = data.facultyName;
    const training = data.training;

    console.log("facultyName:", facultyName, "training:", training);

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const trainingFiles = req.files?.map((file) => file.path) || [];

    let marks = 0;
    if (training === "3 days & above") marks = 5;
    else if (training === "2 days") marks = 3;
    else if (training === "1 day") marks = 1;

    const uniqueFiles = [...new Set(trainingFiles)];

    const maxmark = pointsDistribution[designation]?.service?.Training ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    const employee = req.userId;
        
    let record = await teaching.findOne({ facultyName, designation});
    if (!record) {
      record = new teaching({ facultyName, designation, employee });
    }

    record.training = {
      value: "training",
      marks: finalMarks,
      trainingFiles : uniqueFiles
    };
    await record.save();
    return res.status(200).json({
      section: "training",
      finalMarks,
      file : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
