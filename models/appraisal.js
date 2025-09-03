const mongoose = require("mongoose");

const AppraisalParameterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  label: String,
  description: String,
  functionalArea: String,
  inputType: String,           
  fields: [String],            
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