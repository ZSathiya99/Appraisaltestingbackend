const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  label: String,
  value: String,
  points: Number // optional scoring
});

const AppraisalParameterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  label: String,
  description: String,
  functionalArea: String,
  inputType: String,       // e.g. "radio", "multi-entry"
  options: [OptionSchema], // for radio/select
  fields: [String],        // for multi-entry tables
  attachments: { type: Boolean, default: false },
  maxPoints: {
    prof: Number,
    assoProf: Number,
    asstProf: Number
  },
  isMandatory: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appraisal", AppraisalParameterSchema);
