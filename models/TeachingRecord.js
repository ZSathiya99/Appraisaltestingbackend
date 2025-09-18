const mongoose = require('mongoose');

const TechingSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', 
    required: true
  },

  facultyName: {
    type: String,
    // required: true,
  },
  designation: {
    type: String,
    // required: true,
  },

  teachingAssignment: {
    subjects: {
      type: Object,
      // required : true
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
  studentProject : {
    value: String,   
    marks: Number,
    studentProjectFiles: [String],
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
    value: { type: Object }, 
    marks: Number,
    fdpFiles: [String],
  },
  industry : {
    value : String,
    marks: Number,
    industryFiles: [String],
  },
  tutorMeeting : {
    value: {
    tutorWardMeetings: { type: String },
    valueAdditionInStudentLife: { type: String }
    },
    marks: Number,
    tutorMeetingFiles: [String],
  },
  academicPosition : {
    value: { type: Object },   
    marks: Number,
    academicPositionFiles: [String],
  },
  
  sciePaper :{
    value: { type: Object },   
    marks: Number,
    sciePaperFiles: [String],
  },
  scopusPaper :{
    value: { type: Object },   
    marks: Number,
    scopusPaperFiles: [String],
  },
  aictePaper :{
    value: { type: Object },   
    marks: Number,
    aictePaperFiles: [String],
  },
  scopusBook :{
    value: String,   
    marks: Number,
    scopusBookFiles: [String],
  },
  indexBook :{
    value: String,   
    marks: Number,
    indexBookFiles: [String],
  },

  hIndex :{
    value: String,   
    marks: Number,
    hIndexFiles: [String],
  },
  iIndex :{
    value: String,   
    marks: Number,
    iIndexFiles: [String],
  },
  citation :{
    value: String,   
    marks: Number,
    citationFiles: [String],
  },
  consultancy :{
    value: String,   
    marks: Number,
    consultancyFiles: [String],
  },
  collabrative :{
    value: String,   
    marks: Number,
    collabrativeFiles: [String],
  },
  seedFund :{
    value: String,   
    marks: Number,
    seedFundFiles: [String],
  },
  patent :{
    value: String,   
    marks: Number,
    patentFiles: [String],
  },
  fundedProject :{
    value: String,   
    marks: Number,
    fundedProjectFiles: [String],
  },
  researchScholars:{
    value: String,   
    marks: Number,
    researchScholarsFiles: [String],
  },

  activities:{
    value: String,   
    marks: Number,
    activitiesFiles: [String],
  },

  branding:{
    value: String,   
    marks: Number,
    brandingFiles: [String],
  },
  
  membership:{
    value: String,   
    marks: Number,
    membershipFiles: [String],
  },
  
  external:{
    value: String,   
    marks: Number,
    externalFiles: [String],
  },
  
  administration:{
    value: String,   
    marks: Number,
    administrationFiles: [String],
  },
  
  training:{
    value: String,   
    marks: Number,
    trainingFiles: [String],
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('TeachingRecord', TechingSchema);
