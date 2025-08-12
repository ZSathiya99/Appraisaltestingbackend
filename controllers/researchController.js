const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");


// Q1: SCIE
exports.calculateSciePaper = async (req, res) => {
  try {
    const { scie, facultyName, numPapers } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const paperCount = Number(numPapers) || 1;

    let marks = 0;
    if (scie === "Firstauthor") marks = 4;
    else if (scie === "secondauthor") marks = 2;
    else if (scie === "thirdauthor") marks = 1;
    
    const totalMarks = paperCount * marks;

    const maxPass = pointsDistribution[designation]?.research?.scie ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.sciePaper = {
      value: "SCIE",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "SCIE",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q2: Scopus
exports.calculateScopusPaper = async (req, res) => {
  try {
    const { scopus, facultyName, numPapers } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const paperCount = Number(numPapers) || 1;

    let marks = 0;
    if (scopus === "Firstauthor") marks = 4;
    else if (scopus === "secondauthor") marks = 2;
    else if (scopus === "thirdauthor") marks = 1;
    
    const totalMarks = paperCount * marks;
    
    const maxPass = pointsDistribution[designation]?.research?.scopus ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.scopusPaper = {
      value: "Scopus",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "Scopus",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q3: Aicte
exports.calculateScopusPaper = async (req, res) => {
  try {
    const { aicte, facultyName, numPapers } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const paperCount = Number(numPapers) || 1;

    let marks = 0;
    if (aicte === "Firstauthor") marks = 4;
    else if (aicte === "secondauthor") marks = 2;
    else if (aicte === "thirdauthor") marks = 1;
    
    const totalMarks = paperCount * marks;
    
    const maxPass = pointsDistribution[designation]?.research?.aicte ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.aictePaper = {
      value: "Aicte",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "Aicte",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q4: BookScopus
exports.calculateScopusBook = async (req, res) => {
  try {
    const { facultyName, numBook } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
  
    const bookCount = Number(numBook) || 0;

    let marks = 2;
  
    const totalMarks = bookCount * marks;
    
    const maxPass = pointsDistribution[designation]?.research?.book_scopus ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.scopusBook = {
      value: "ScopusBook",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "ScopusBook",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q5: IndexedBook
exports.calculateIndexedBook = async (req, res) => {
  try {
    const { facultyName, numPaper } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
  
    const paperCount = Number(numPaper) || 0;

    let marks = 1;
  
    const totalMarks = paperCount * marks;
    
    const maxPass = pointsDistribution[designation]?.research?.indexbook ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.indexBook = {
      value: "IndexBook",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "IndexBook",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q5: IndexedBook
exports.calculateIndexedBook = async (req, res) => {
  try {
    const { facultyName, numPaper } = req.body;
    const { designation } = req.params;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
  
    const paperCount = Number(numPaper) || 0;

    let marks = 1;
  
    const totalMarks = paperCount * marks;
    
    const maxPass = pointsDistribution[designation]?.research?.indexbook ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.indexBook = { 
      value: "IndexBook",
      marks: finalMarks
    };

    await record.save();
    return res.status(200).json({
      section: "IndexBook",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q6: Patent
exports.calculatePatentMarks = async (req, res) => {
  try {
    const { facultyName, patentType, numPatent } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const patentCount = Number(numPatent) || 0;
    let marks = 0;

    if (patentType === "Published") marks = 1;
    else if (patentType === "Utilitygranted") marks = 3;
    else if (patentType === "Designothers") marks = 2;

    const totalMarks = patentCount * marks;

    const maxPass = pointsDistribution[designation]?.research?.patent ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.patent = {
      value: "Patent",
      marks: finalMarks,
    };

    await record.save();

    return res.status(200).json({
      section: "Patent",
      type: patentType,
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q6: hindex
exports.calculatehIndex = async (req, res) => {
  try {
    const { facultyName, hindex } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    let hMarks = 0;
    if (hindex >= 5) hMarks = 3;
    else if (hindex >= 3) hMarks = 2;
    else if (hindex >= 2) hMarks = 1;

    const maxPass = pointsDistribution[designation]?.research?.hindex ?? 0;
    const finalMarks = Math.min(hMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.hIndex = {
      value: "hindex",
      marks: finalMarks,
    };

    await record.save();

    return res.status(200).json({
      section: "hindex",
      type: patentType,
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q6: h index
exports.calculatehIndex = async (req, res) => {
  try {
    const { facultyName, hindex } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    let hMarks = 0;
    if (hindex >= 5) hMarks = 3;
    else if (hindex >= 3) hMarks = 2;
    else if (hindex >= 2) hMarks = 1;

    const maxPass = pointsDistribution[designation]?.research?.hindex ?? 0;
    const finalMarks = Math.min(hMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.hIndex = {
      value: "hindex",
      marks: finalMarks,
    };

    await record.save();

    return res.status(200).json({
      section: "hindex",
      type: patentType,
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};