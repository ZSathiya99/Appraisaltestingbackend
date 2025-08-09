const teaching = require('../models/TeachingRecord');
const Subject = require('../models/Subject');
const pointsDistribution = require("../utils/prePoints");
const fs = require("fs");
const path = require("path");

exports.getPointsByDesignation = (req, res) => {
  const { designation } = req.params;
  console.log(designation)
  const points = pointsDistribution[designation];

  if (!points) {
    return res.status(404).json({ message: 'Designation not found' });
  }
  const formatted = Object.entries(points).map(([category, pointObj]) => ({
    category,
    points: pointObj 
  }));

  res.json(formatted);
};


// Q1: TEACHING ASSIGNMENT
exports.calculateTeachingMarks = async (req, res) => {
  try {
    const { teachingAssignment, facultyName } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const Teachingfiles = req.files?.map((file) => file.path) || [];
    console.log(Teachingfiles);
    let parsedSubjects;
    try {
      parsedSubjects = Array.isArray(teachingAssignment)
        ? teachingAssignment
        : JSON.parse(teachingAssignment);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON in teachingAssignment' });
    }

    const formattedSubjects = {};
    let teachingMarks = 0;

    for (const subj of parsedSubjects) {
      const { subjectCode, subjectName, credits } = subj;
      formattedSubjects[subjectCode] = subjectName;

      const result = await Subject.updateOne(
        { subjectCode },
        { $set: { subjectName, credits: Number(credits) } },
        { upsert: true }
      );


      if (Number(credits) === 3 && teachingMarks < 3) {
        teachingMarks += 1;
      }
    }

    const uniqueFiles = [...new Set(Teachingfiles)];
    console.log(uniqueFiles);
    const maxTeaching = pointsDistribution[designation]?.teaching?.teachingAssignment ?? 0;
    const finalMarks = Math.min(teachingMarks, maxTeaching);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.teachingAssignment = {
      value: parsedSubjects,
      marks: finalMarks,
      teachingFiles: uniqueFiles
    };

    return res.status(200).json({
      message: "Teaching marks calculated successfully",
      finalMarks,
      files: uniqueFiles
    });

  } catch (error) {
    console.error("Teaching mark calculation failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


// Q2: PASS PERCENTAGE
exports.calculatePassPercentageMarks = async (req, res) => {
  try {
    const { passPercentage } = req.body;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    let marks = 0;
    if (passPercentage === "100%") marks = 3;
    else if (passPercentage === "90 to 99%") marks = 2;
    else if (passPercentage === "80 to 89%") marks = 1;
    
    const maxPass = pointsDistribution[designation]?.teaching?.passPercentage ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.passPercentage = {
      value: passPercentage,
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "Pass Percentage",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q3: STUDENT FEEDBACK
exports.calculateStudentFeedbackMarks = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    let marks = 0;
    if (feedback === "100 to 91") marks = 3;
    else if (feedback === "90 to 81") marks = 2;
    else if (feedback === "Less than or equal to 80") marks = 1;
    
    const maxmark = pointsDistribution[designation]?.teaching?.studentFeedback ?? 0;
    const finalMarks = Math.min(marks, maxmark);
    
    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.feedback = {
      value: feedback,
      marks: finalMarks
    };

    await record.save();

    return res.status(200).json({
      section: "Student Feedback",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q4: Innovative Approach
exports.calculateInnovativeApporachMarks = async (req, res) => {
  try {
    const { InnovativeApproach, facultyName } = req.body;
    const { designation } = req.params;


    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const Innovativefiles = req.files?.map((file) => file.path) || [];
    console.log(Innovativefiles);
    let marks = 0;
    if (InnovativeApproach === "Classroom Teaching") marks = 1;
    else if (InnovativeApproach === "Lab") marks = 2;
    else if (InnovativeApproach === "Both") marks = 3;

    const uniqueFiles = [...new Set(Innovativefiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.innovativeApproach ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.innovativeApproach = {
      value: InnovativeApproach,
      marks: finalMarks,
      innovativeApproachFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Innovative Approach",
      finalMarks,
      files : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q5: Guest lecture
exports.calculateGuestlectureMarks = async (req, res) => {
  try {
    const { GuestLecture } = req.body;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    const GuestLectureFiles = req.files?.map((file) => file.path) || [];

    let marks = 0;
    if (GuestLecture === "National Experts") marks = 1;
    else if (GuestLecture === "International Experts") marks = 2;

    const uniqueFiles = [...new Set(GuestLectureFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.guest ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.visitingFaculty = {
      value: GuestLecture,
      marks: finalMarks,
      visitingFacultyFiles : uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Guest Lectures",
      finalMarks,
      files : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q6: FDP Funding
exports.calculateFdpfundingMarks = async (req, res) => {
  try {
    const { FdpFunding } = req.body;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const FdpFundingFiles = req.files?.map((file) => file.path) || [];

    let marks = 0;
    if (FdpFunding === "less than 1 lakh") marks = 1;
    else if (FdpFunding === "1-2 lakh") marks = 2;
    else if (FdpFunding === "greater than 2 lakh") marks = 3;

    const uniqueFiles = [...new Set(FdpFundingFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.fdpFunding ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.fdpFunding = {
      value: FdpFunding,
      marks: finalMarks,
      fdpFundingFiles : uniqueFiles
    };

    return res.status(200).json({
      section: "FDP Funding",
      finalMarks,
      files : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q7: Highlevel Competion
exports.calculateHighlevelCompetionMarks = async (req, res) => {
  try {
    const { highlevelCompetition } = req.body;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const HighlevelCompetitionFiles = req.files?.map((file) => file.path) || [];

    let marks = 0;
    if (highlevelCompetition === "Participation") marks = 2;
    else if (highlevelCompetition === "Participation Greater than 1") marks = 3;
    else if (highlevelCompetition === "Participation & Prize") marks = 3;
    else if (highlevelCompetition === "Participation Greater than 1 & Prize") marks = 4;

    const uniqueFiles = [...new Set(HighlevelCompetitionFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.innovativeProjects ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.innovationProject = {
      value: highlevelCompetition,
      marks: finalMarks,
      innovationProjectFiles : uniqueFiles
    };
    return res.status(200).json({
      section: "HighLevel Competion",
      finalMarks,
      file : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q8: FdpProgram
exports.calculateFdpProgramMarks = async (req, res) => {
  try {
    const semesterData = JSON.parse(req.body.semesterData);
    const { designation } = req.params;
    const {facultyName} = req.body;

    console.log("==== Incoming Request ====");
    console.log("Body:", req.body);
    console.log("Params:", req.params);
    console.log("Files:", req.files);

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const FdpprogramFiles = req.files?.map((file) => file.path) || [];


    const isTrue = (val) => val === true || val === 'true';

    const semesterWiseMarks = {};
    let totalMarks = 0;

    for (const semester in semesterData) {
      let marks = 0;

      if (isTrue(semesterData[semester].fdp)) marks += 4;
      if (isTrue(semesterData[semester].online)) marks += 1;

      semesterWiseMarks[semester] = marks;
      totalMarks += marks;
    }

    const uniqueFiles = [...new Set(FdpprogramFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.fdpProgramme ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark); 

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.fdp = {
      value: semesterData,
      marks: finalMarks,
      fdpFiles : uniqueFiles
    };

   
    return res.status(200).json({
      finalMarks,
      files : uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q9: Industry Involvement
exports.calculateIndustryInvolvementMarks = async (req, res) => {
  try {

    const input = req.body.industryInvolvement;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    
    const IndustryFiles = req.files?.map((file) => file.path) || [];
    console.log(IndustryFiles);
    const isYes = input?.toLowerCase() === 'yes';
    const marks = isYes ? 2 : 0;
    const uniqueFiles = [...new Set(IndustryFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.industryInvolvement ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });

    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.industry = {
      value: input,
      marks: finalMarks,
      industryFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      finalMarks,
      message: isYes ? "Eligible for 2 marks" : "No marks awarded",
      files: uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q10: TutorWard Meeting
exports.calculateTutorWardMarks = async (req, res) => {
  try {
    const meetings = req.body.tutorWardMeetings?.toLowerCase() === 'yes' ? 3 : 0;
    const valueAdd = req.body.valueAdditionInStudentLife?.toLowerCase() === 'yes' ? 2 : 0;

    const { designation } = req.params;
    const {facultyName} = req.body;


    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const totalMarks = meetings + valueAdd;

    const valueAdditionFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(valueAdditionFiles)];
    const maxmark = pointsDistribution[designation]?.teaching?.tutorMeeting ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.tutorMeeting = {
      value: tutorMeeting,
      marks: finalMarks,
      tutorMeetingFiles : uniqueFiles
    };


    return res.status(200).json({
      finalMarks,
      files: valueAdditionFiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q11: Roles in Academic
exports.calculateRoleMarks = async  (req, res) => {
  try {
    const roles = req.body.roles; 
    const { designation } = req.params;
    const {facultyName} = req.body;


    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const files = req.files?.map((file) => file.path) || [];

    const academicRoles = ['Academic Coordinator', 'Class Advisor'];
    const otherRoles = [
      'Course Coordinator',
      'Timetable Coordinator',
      'Exam Cell',
      'Lab Coordinator',
      'Project Coordinator',
    ];

    let marks = 0;
    let countedAcademic = false;

    if (Array.isArray(roles)) {
      roles.forEach(role => {
        if (!countedAcademic && academicRoles.includes(role)) {
          marks += 2;
          countedAcademic = true; 
        } else if (otherRoles.includes(role)) {
          marks += 1;
        }
      });
    }

    const uniqueFiles = [...new Set(files)];

    const maxmark = pointsDistribution[designation]?.teaching?.academicRoles ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.academicPosition = {
      value: academicRoles,
      marks: finalMarks,
      academicPositionFiles : uniqueFiles
    };


    return res.status(200).json({
      finalMarks,
      files: uniqueFiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Get a teaching record 
exports.getTeachingRecord = async (req, res) => {
  try {
    const { facultyName, designation } = req.body;

    if (!facultyName) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const filter = { facultyName };
    if (designation) filter.designation = designation;

    const record = await teaching.findOne(filter);

    if (!record) {
      return res.status(404).json({ message: "No teaching record found" });
    }

    return res.status(200).json({
      message: "Teaching record fetched successfully",
      record
    });

  } catch (err) {
    console.error("Error fetching teaching record:", err.message);
    return res.status(500).json({ error: err.message });
  }
};




exports.deleteImage = async (req, res) => {
  const { filename } = req.params;
  
  const filePath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Failed to delete file" });
      }
      return res.json({ message: "File deleted successfully" });
    });
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};
