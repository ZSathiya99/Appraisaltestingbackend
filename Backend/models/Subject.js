const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectCode : {type : String, required: true, unique: true},
    subjectName : String ,
    credits : Number,
});

module.exports = mongoose.model('Subject', subjectSchema);