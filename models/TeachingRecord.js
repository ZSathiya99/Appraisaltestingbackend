const mongoose = require('mongoose');

const TechingSchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },

  teachingAssignment: {
    subjects: {
      type: Object,
      required : true
    },
    teachingFiles: [String],
    marks: Number,
  },
  passPercentage: {
    value: String,   
    marks: Number    
  },
  feedback :{
    value: String,   
    marks: Number,
    feedbackFiles: [String],
  },
  innovativeApproach : {
    value: String,   
    marks: Number,
    innovativeApproachFiles: [String],
  },
  visitingFaculty : {
    value: String,   
    marks: Number,
    visitingFacultyFiles: [String],
  },
  fdpFunding : {
    value: String,   
    marks: Number,
    fdpFundingFiles: [String],
  },
  innovationProject : {
    value: String,   
    marks: Number,
    innovationProjectFiles: [String],
  },
  fdp : {
    value: String,   
    marks: Number,
    fdpFiles: [String],
  },
  industry : {
    value : String,
    marks: Number,
    industryFiles: [String],
  },
  tutorMeeting : {
    value: String,   
    marks: Number,
    tutorMeetingFiles: [String],
  },
  academicPosition : {
    value: String,   
    marks: Number,
    academicPositionFiles: [String],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('TeachingRecord', TechingSchema);
