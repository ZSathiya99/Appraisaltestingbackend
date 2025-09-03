const AppraisalParameter = require("../models/appraisal");


exports.postQuestions = async (req, res) => {
  try {
    const {
      key,
      label,
      description,
      functionalArea,
      inputType,
      fields,
      attachments,
      maxPoints,
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
      fields,
      attachments,
      maxPoints,
    });

    await param.save();
    res.status(201).json({ message: "Parameter created successfully", param });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating parameter", error: err.message });
  }
};


