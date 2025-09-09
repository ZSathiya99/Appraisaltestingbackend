const AppraisalParameter = require("../models/appraisal");
const TeachingRecord = require("../models/TeachingRecord");

// Map TeachingRecord fields to Appraisal keys
const FIELD_MAP = {
  passPercentage: "passPercentage",
  feedback: "feedback",
  innovativeApproach: "innovativeApproach",
  visitingFaculty: "visitingFaculty",
  studentProject: "studentProject",
  fdpFunding: "fdpFunding",
  innovationProject: "innovationProject",
  fdp: "fdp",
  industry: "industry",
  tutorMeeting: "tutorMeeting",
  academicPosition: "academicPosition",
  sciePaper: "sciePaper",
  scopusPaper: "scopusPaper",
  aictePaper: "aictePaper",
  scopusBook: "scopusBook",
  indexBook: "indexBook",
  hIndex: "hIndex",
  iIndex: "iIndex",
  citation: "citation",
  consultancy: "consultancy",
  collabrative: "collabrative",
  seedFund: "seedFund",
  patent: "patent",
  fundedProject: "fundedProject",
  researchScholars: "researchScholars",
  activities: "activities",
  branding: "branding",
  membership: "membership",
  external: "external",
  administration: "administration",
  training: "training",
  teachingAssignment: "teachingAssignment"
};

// GET /admin/review/:recordId
exports.getAnswers =  async (req, res) => {
  try {
    const record = await TeachingRecord.findById(req.params.recordId).populate("employee");
    if (!record) {
      return res.status(404).json({ message: "Teaching record not found" });
    }

    const parameters = await AppraisalParameter.find();

    const merged = parameters
      .map(param => {
        const fieldName = Object.keys(FIELD_MAP).find(k => FIELD_MAP[k] === param.key);
        const fieldData = fieldName ? record[fieldName] : null;

        if (!fieldData) return null;

        return {
          key: param.key,
          label: param.label,
          description: param.description,
          functionalArea: param.functionalArea,
          inputType: param.inputType,
          options: param.options,
          maxPoints: param.maxPoints,
          isMandatory: param.isMandatory,
          userValue: fieldData.value ?? fieldData.subjects ?? null,
          marks: fieldData.marks ?? 0,
          files: Object.keys(fieldData)
            .filter(k => Array.isArray(fieldData[k]))
            .reduce((acc, k) => acc.concat(fieldData[k]), [])
        };
      })
      .filter(Boolean); // skip nulls

    res.json({
      employee: record.employee,
      facultyName: record.facultyName,
      designation: record.designation,
      approvalStatus: record.approvalStatus,
      isSubmitted: record.isSubmitted,
      questions: merged
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error merging data", error: err.message });
  }
};




exports.postQuestions = async (req, res) => {
  try {
    const {
      key,
      label,
      description,
      functionalArea,
      inputType,
      options,        // <-- must destructure
      fields,
      attachments,
      scoringRules,
      maxPoints,
      isMandatory
    } = req.body;

    // Basic validation
    if (!key || !label || !functionalArea || !inputType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicate key
    const existing = await AppraisalParameter.findOne({ key });
    if (existing) {
      return res.status(409).json({ message: `Parameter with key '${key}' already exists` });
    }

    const param = new AppraisalParameter({
     key,
      label,
      description,
      functionalArea,
      inputType,
      options,        // <-- must pass it here
      fields,
      attachments,
      scoringRules,
      maxPoints,
      isMandatory
    });

    await param.save();
    res.status(201).json({ message: "Parameter created successfully", param });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating parameter", error: err.message });
  }
};


