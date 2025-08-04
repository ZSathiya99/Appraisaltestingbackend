const teaching = require('../models/TeachingRecord');
const Subject = require('../models/Subject');


// Q1: TEACHING ASSIGNMENT
exports.calculateTeachingMarks = async (req, res) => {
  try {
    const { teachingAssignment } = req.body;
    const Teachingfiles = req.files ?. req.Teachingfiles.map(file => file.path) || [];

    const parsedSubjects = JSON.parse(teachingAssignment);
    const formattedSubjects = {};
    let teachingMarks = 0;

    for (const subj of parsedSubjects) {
      const { subjectCode, subjectName, credits } = subj;
      formattedSubjects[subjectCode] = subjectName;

      await Subject.updateOne(
        { subjectCode },
        { $setOnInsert: { subjectName, credits } },
        { upsert: true }
      );

      if (credits === 3 && teachingMarks < 3) {
        teachingMarks += 1;
      }
    }

    const uniqueFiles = [...new Set(Teachingfiles)];

    return res.status(200).json({
      message: "Teaching marks calculated successfully",
      teachingMarks,
      subjects: formattedSubjects,
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

    let marks = 0;
    if (passPercentage === "100%") marks = 3;
    else if (passPercentage === "90 to 99%") marks = 2;
    else if (passPercentage === "80 to 89%") marks = 1;
    

    return res.status(200).json({
      section: "Pass Percentage",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q3: STUDENT FEEDBACK
exports.calculateStudentFeedbackMarks = (req, res) => {
  try {
    const { feedback } = req.body;

    let marks = 0;
    if (feedback === "100 to 91") marks = 3;
    else if (feedback === "90 to 81") marks = 2;
    else if (feedback === "Less than or equal to 80") marks = 1;

    return res.status(200).json({
      section: "Student Feedback",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q4: Innovative Approach
exports.calculateInnovativeApporachMarks = (req, res) => {
  try {
    const { InnovativeApproach } = req.body;
    const Innovativefiles = req.files ?. req.Innovativefiles.map(file => file.path) || [];


    let marks = 0;
    if (InnovativeApproach === "Classroom Teaching") marks = 1;
    else if (InnovativeApproach === "Lab") marks = 2;
    else if (InnovativeApproach === "Both") marks = 3;

    const uniqueFiles = [...new Set(Innovativefiles)];

    return res.status(200).json({
      section: "Innovative Approach",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q5: Guest lecture
exports.calculateGuestlectureMarks = (req, res) => {
  try {
    const { GuestLecture } = req.body;
    const GuestLectureFiles = req.files ?. req.GuestLectureFiles.map(file => file.path) || [];


    let marks = 0;
    if (GuestLecture === "National Experts") marks = 1;
    else if (GuestLecture === "International Experts") marks = 2;

    const uniqueFiles = [...new Set(GuestLectureFiles)];

    return res.status(200).json({
      section: "Guest Lectures",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q6: FDP Funding
exports.calculateFdpfundingMarks = (req, res) => {
  try {
    const { FdpFunding } = req.body;
    const FdpFundingFiles = req.files ?. req.FdpFundingFiles.map(file => file.path) || [];


    let marks = 0;
    if (FdpFunding === "less than 1 lakh") marks = 1;
    else if (FdpFunding === "1-2 lakh") marks = 2;
    else if (FdpFunding === "greater than 2 lakh") marks = 3;

    const uniqueFiles = [...new Set(FdpFundingFiles)];

    return res.status(200).json({
      section: "FDP Funding",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q7: Highlevel Competion
exports.calculateHighlevelCompetionMarks = (req, res) => {
  try {
    const { highlevelCompetition } = req.body;
    const HighlevelCompetitionFiles = req.files ?. req.HighlevelCompetitionFiles.map(file => file.path) || [];


    let marks = 0;
    if (highlevelCompetition === "Participation") marks = 2;
    else if (highlevelCompetition === "Participation Greater than 1") marks = 3;
    else if (highlevelCompetition === "Participation & Prize") marks = 3;
    else if (highlevelCompetition === "Participation Greater than 1 & Prize ") marks = 4;

    const uniqueFiles = [...new Set(HighlevelCompetitionFiles)];

    return res.status(200).json({
      section: "HighLevel Competion",
      marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q8: FdpProgram
exports.calculateFdpProgramMarks = (req, res) => {
  try {

    const semesterData = JSON.parse(req.body.semesterData);

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

    return res.status(200).json({
      totalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q9: Industry Involvement
exports.calculateIndustryInvolvementMarks = (req, res) => {
  try {
    const input = req.body.industryInvolvement;
    const IndustryFiles = req.files?.IndustryFiles?.map(file => file.path) || [];
    const isYes = input?.toLowerCase() === 'yes';
    const marks = isYes ? 2 : 0;
    const uniqueFiles = [...new Set(IndustryFiles)];
    return res.status(200).json({
      marks,
      message: isYes ? "Eligible for 2 marks" : "No marks awarded",
      files: uniqueFiles
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

    const totalMarks = meetings + valueAdd;

    const valueAdditionFiles = req.files?.ValueAdditionFiles?.map(file => file.path) || [];

    return res.status(200).json({
      totalMarks,
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

    return res.status(200).json({
      marks,
      files: uniqueFiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
