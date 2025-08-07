const teaching = require('../models/TeachingRecord');
const Subject = require('../models/Subject');
const pointsDistribution = require("../utils/prePoints")

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
    const { teachingAssignment } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const Teachingfiles = req.files?.Teachingfiles?.map(file => file.path) || [];
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

    return res.status(200).json({
      message: "Teaching marks calculated successfully",
      finalMarks,
      // subjects: formattedSubjects,
      files: uniqueFiles
    });

  } catch (error) {
    console.error("Teaching mark calculation failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


// Q2: PASS PERCENTAGE
exports.calculatePassPercentageMarks = (req, res) => {
  try {
    const { passPercentage } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    let marks = 0;
    if (passPercentage === "100%") marks = 3;
    else if (passPercentage === "90 to 99%") marks = 2;
    else if (passPercentage === "80 to 89%") marks = 1;
    
    const maxPass = pointsDistribution[designation]?.teaching?.passPercentage ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    return res.status(200).json({
      section: "Pass Percentage",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q3: STUDENT FEEDBACK
exports.calculateStudentFeedbackMarks = (req, res) => {
  try {
    const { feedback } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    let marks = 0;
    if (feedback === "100 to 91") marks = 3;
    else if (feedback === "90 to 81") marks = 2;
    else if (feedback === "Less than or equal to 80") marks = 1;
    
    const maxmark = pointsDistribution[designation]?.teaching?.studentFeedback ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      section: "Student Feedback",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q4: Innovative Approach
exports.calculateInnovativeApporachMarks = (req, res) => {
  try {
    const { InnovativeApproach } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    const Innovativefiles = req.files ?. req.Innovativefiles.map(file => file.path) || [];


    let marks = 0;
    if (InnovativeApproach === "Classroom Teaching") marks = 1;
    else if (InnovativeApproach === "Lab") marks = 2;
    else if (InnovativeApproach === "Both") marks = 3;

    const uniqueFiles = [...new Set(Innovativefiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.innovativeApproach ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      section: "Innovative Approach",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q5: Guest lecture
exports.calculateGuestlectureMarks = (req, res) => {
  try {
    const { GuestLecture } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    const GuestLectureFiles = req.files ?. req.GuestLectureFiles.map(file => file.path) || [];


    let marks = 0;
    if (GuestLecture === "National Experts") marks = 1;
    else if (GuestLecture === "International Experts") marks = 2;

    const uniqueFiles = [...new Set(GuestLectureFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.guest ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      section: "Guest Lectures",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q6: FDP Funding
exports.calculateFdpfundingMarks = (req, res) => {
  try {
    const { FdpFunding } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const FdpFundingFiles = req.files ?. req.FdpFundingFiles.map(file => file.path) || [];


    let marks = 0;
    if (FdpFunding === "less than 1 lakh") marks = 1;
    else if (FdpFunding === "1-2 lakh") marks = 2;
    else if (FdpFunding === "greater than 2 lakh") marks = 3;

    const uniqueFiles = [...new Set(FdpFundingFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.fdpFunding ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      section: "FDP Funding",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q7: Highlevel Competion
exports.calculateHighlevelCompetionMarks = (req, res) => {
  try {
    const { highlevelCompetition } = req.body;
    const { designation } = req.params;
    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const HighlevelCompetitionFiles = req.files ?. req.HighlevelCompetitionFiles.map(file => file.path) || [];


    let marks = 0;
    if (highlevelCompetition === "Participation") marks = 2;
    else if (highlevelCompetition === "Participation Greater than 1") marks = 3;
    else if (highlevelCompetition === "Participation & Prize") marks = 3;
    else if (highlevelCompetition === "Participation Greater than 1 & Prize ") marks = 4;

    const uniqueFiles = [...new Set(HighlevelCompetitionFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.innovativeProjects ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      section: "HighLevel Competion",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q8: FdpProgram
exports.calculateFdpProgramMarks = (req, res) => {
  try {
    const semesterData = JSON.parse(req.body.semesterData);
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const FdpprogramFiles = req.files?.FdpprogramFiles?.map(file => file.path) || [];

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

    return res.status(200).json({
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q9: Industry Involvement
exports.calculateIndustryInvolvementMarks = (req, res) => {
  try {
    console.log("==== Incoming Request ====");
    console.log("Body:", req.body);
    console.log("Params:", req.params);
    console.log("Files:", req.files);

    const input = req.body.industryInvolvement;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const groupedFile = {};

    req.files.forEach((file) => {
      const category = file.fieldname;
      if(!groupedFile[category]){
        groupedFile[category] = [];
      }
      groupedFile[category].push(file.path);
      console.log(groupedFile)

    });
    // const IndustryFiles = req.files?.map((file) => file.path) || [];
    console.log(IndustryFiles);
    const isYes = input?.toLowerCase() === 'yes';
    const marks = isYes ? 2 : 0;
    // const uniqueFiles = [...new Set(IndustryFiles)];

    const maxmark = pointsDistribution[designation]?.teaching?.industryInvolvement ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      finalMarks,
      message: isYes ? "Eligible for 2 marks" : "No marks awarded",
      files: groupedFile
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q10: TutorWard Meeting
exports.calculateTutorWardMarks = (req, res) => {
  try {
    const meetings = req.body.tutorWardMeetings?.toLowerCase() === 'yes' ? 3 : 0;
    const valueAdd = req.body.valueAdditionInStudentLife?.toLowerCase() === 'yes' ? 2 : 0;

    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const totalMarks = meetings + valueAdd;

    const valueAdditionFiles = req.files?.ValueAdditionFiles?.map(file => file.path) || [];

    const maxmark = pointsDistribution[designation]?.teaching?.tutorMeeting ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    return res.status(200).json({
      finalMarks,
      files: valueAdditionFiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q11: Roles in Academic
exports.calculateRoleMarks = (req, res) => {
  try {
    const roles = req.body.roles; 
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    const files = req.files?.RoleFiles?.map(file => file.path) || [];

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

    return res.status(200).json({
      finalMarks,
      files: uniqueFiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



exports.saveTeachingRecord = async (req, res) => {
  try {
    const {
      facultyName,
      designation
    } = req.body;

    // Parse nested JSON fields from FormData
    const teachingAssignment = JSON.parse(req.body.teachingAssignment || '{}');
    const passPercentage = JSON.parse(req.body.passPercentage || '{}');
    const feedback = JSON.parse(req.body.feedback || '{}');
    const innovativeApproach = JSON.parse(req.body.innovativeApproach || '{}');
    const visitingFaculty = JSON.parse(req.body.visitingFaculty || '{}');
    const fdpFunding = JSON.parse(req.body.fdpFunding || '{}');
    const innovationProject = JSON.parse(req.body.innovationProject || '{}');
    const fdp = JSON.parse(req.body.fdp || '{}');
    const industry = JSON.parse(req.body.industry || '{}');
    const tutorMeeting = JSON.parse(req.body.tutorMeeting || '{}');
    const academicPosition = JSON.parse(req.body.academicPosition || '{}');

    if (!facultyName || !designation) {
      return res.status(400).json({ message: 'Faculty name and designation are required' });
    }

    let record = await TeachingRecord.findOne({ facultyName, designation });
    if (!record) {
      record = new TeachingRecord({ facultyName, designation });
    }

    // Assign parsed fields
    if (teachingAssignment) {
      teachingAssignment.teachingFiles = req.files?.teachingFiles?.map(f => f.path) || [];
      record.teachingAssignment = teachingAssignment;
    }

    if (passPercentage) record.passPercentage = passPercentage;

    if (feedback) {
      feedback.feedbackFiles = req.files?.feedbackFiles?.map(f => f.path) || [];
      record.feedback = feedback;
    }

    if (innovativeApproach) {
      innovativeApproach.innovativeApproachFiles = req.files?.innovativeApproachFiles?.map(f => f.path) || [];
      record.innovativeApproach = innovativeApproach;
    }

    if (visitingFaculty) {
      visitingFaculty.visitingFacultyFiles = req.files?.visitingFacultyFiles?.map(f => f.path) || [];
      record.visitingFaculty = visitingFaculty;
    }

    if (fdpFunding) {
      fdpFunding.fdpFundingFiles = req.files?.fdpFundingFiles?.map(f => f.path) || [];
      record.fdpFunding = fdpFunding;
    }

    if (innovationProject) {
      innovationProject.innovationProjectFiles = req.files?.innovationProjectFiles?.map(f => f.path) || [];
      record.innovationProject = innovationProject;
    }

    if (fdp) {
      fdp.fdpFiles = req.files?.fdpFiles?.map(f => f.path) || [];
      record.fdp = fdp;
    }

    if (industry) {
      industry.industryFiles = req.files?.industryFiles?.map(f => f.path) || [];
      record.industry = industry;
    }

    if (tutorMeeting) {
      tutorMeeting.tutorMeetingFiles = req.files?.tutorMeetingFiles?.map(f => f.path) || [];
      record.tutorMeeting = tutorMeeting;
    }

    if (academicPosition) {
      academicPosition.academicPositionFiles = req.files?.academicPositionFiles?.map(f => f.path) || [];
      record.academicPosition = academicPosition;
    }

    await record.save();

    return res.status(200).json({
      message: "Teaching record saved successfully",
      record
    });

  } catch (err) {
    console.error("Failed to save teaching record:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
