const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");


// Q1: SCIE
exports.calculateSciePaper = async (req, res) => {
  try {
    const { facultyName} = req.body; 
    const { designation } = req.params;
    let { scie } = req.body;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const sciePaperFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(sciePaperFiles)];

    if (typeof scie === "string") {
      try {
        scie = JSON.parse(scie);
      } catch {
        return res.status(400).json({ error: "Invalid SCIE data format" });
      }
    }

    if (!Array.isArray(scie) || scie.length === 0) {
      return res.status(400).json({ error: "SCIE must be a non-empty array" });
    }


    let totalMarks = 0;
    scie.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 4;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 2;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 1;
    });
    const maxPass = pointsDistribution[designation]?.research?.scie ?? totalMarks;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.sciePaper = {
      value: "SCIE",
      marks: finalMarks,
      sciePaperFiles:  uniqueFiles
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
    const { facultyName} = req.body;
    const { designation } = req.params;
    let { scopus } = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const scopusPaperFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(scopusPaperFiles)];

    if (typeof scopus === "string") {
      try {
        scopus = JSON.parse(scopus);
      } catch {
        return res.status(400).json({ error: "Invalid scopus data format" });
      }
    }

    if (!Array.isArray(scopus) || scopus.length === 0) {
      return res.status(400).json({ error: "scopus must be a non-empty array" });
    }


    let totalMarks = 0;
    scopus.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 4;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 2;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 1;
    });
    
    
    const maxPass = pointsDistribution[designation]?.research?.scopus ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.scopusPaper = {
      value: "Scopus",
      marks: finalMarks,
      scopusPaperFiles : uniqueFiles
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
exports.calculateAictePaper = async (req, res) => {
  try {
    const {facultyName} = req.body;
    const { designation } = req.params;
    let { aicte } = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });
    
    const AicteFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(AicteFiles)];
    
    if (typeof aicte === "string") {
      try {
        aicte = JSON.parse(aicte);
      } catch {
        return res.status(400).json({ error: "Invalid aicte data format" });
      }
    }

    if (!Array.isArray(aicte) || aicte.length === 0) {
      return res.status(400).json({ error: "aicte must be a non-empty array" });
    }


    let totalMarks = 0;
    aicte.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 4;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 2;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 1;
    });
    
    
    const maxPass = pointsDistribution[designation]?.research?.aicte ?? 0;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.aictePaper = {
      value: "Aicte",
      marks: finalMarks,
      aictePaperFiles : uniqueFiles
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
    
    const IndexFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(IndexFiles)];

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
      marks: finalMarks,
      indexBookFiles : uniqueFiles
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

    const PatentFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(PatentFiles)];

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
      patentFiles : uniqueFiles
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


// Q7: hindex
exports.calculatehIndex = async (req, res) => {
  try {
    const { facultyName, hindex } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    let hMarks = 0;
    if (hindex === "5 and above") hMarks = 3;
    else if (hindex === 3) hMarks = 2;
    else if (hindex === 2) hMarks = 1;

    const hindexFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(hindexFiles)];

    const maxPass = pointsDistribution[designation]?.research?.hindex ?? 0;
    const finalMarks = Math.min(hMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.hIndex = {
      value: "hindex",
      marks: finalMarks,
      hIndexFiles : uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "hindex",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q8: 10index
exports.calculateIIndex = async (req, res) => {
  try {
    const { facultyName, Iindex } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }
    const IindexFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(IindexFiles)];
    let marks = 0;
    if (Iindex === "2 and above") marks = 3;
    else if (Iindex === 1) marks = 2;

    const maxPass = pointsDistribution[designation]?.research?.i10index ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.iIndex = {
      value: "Iindex",
      marks: finalMarks,
      iIndexFiles : uniqueFiles

    };

    await record.save();

    return res.status(200).json({
      section: "Iindex",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Q9: Citation
exports.calculateCitation = async (req, res) => {
  try {
    const { facultyName, citation } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const citationFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(citationFiles)];

    let marks = 0;
    if (citation === "100 and above") marks = 3;
    else if (citation === 50) marks = 2;
    else if (citation === 25) marks = 1;

    const maxPass = pointsDistribution[designation]?.research?.citation ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.citation = {
      value: "citation",
      marks: finalMarks,
      citationFiles: uniqueFiles,

    };

    await record.save();

    return res.status(200).json({
      section: "citation",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Q10: Consultancy
exports.calculateConsultancy = async (req, res) => {
  try {
    const { facultyName, consultancy } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }
    const consultancyFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(consultancyFiles)];

    let marks = 0;
    if (consultancy === "upto one lakh") marks = 2;
    else if (consultancy === "two lakh") marks = 3;
    else if (consultancy === "greater than five") marks = 4;

    const maxPass = pointsDistribution[designation]?.research?.citation ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.consultancy = {
      value: "Consultancy",
      marks: finalMarks,
      consultancyFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Consultancy",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Q11: foreign 
exports.calculateForeignMarks = async (req, res) => {
  try {

    const input = req.body.foreignWork;
    const { designation } = req.params;
    const {facultyName} = req.body;

    if (!designation) return res.status(400).json({ message: 'Designation missing in token' });

    
    const foreignFiles = req.files?.map((file) => file.path) || [];
    const isYes = input?.toLowerCase() === 'yes';
    const marks = isYes ? 2 : 0;
    const uniqueFiles = [...new Set(foreignFiles)];

    const maxmark = pointsDistribution[designation]?.research?.collabrative ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    let record = await teaching.findOne({ facultyName, designation });

    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.collabrative = {
      value: input,
      marks: finalMarks,
      collabrativeFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      finalMarks,
      files: uniqueFiles
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q12: SeedFund
exports.calculateSeedFund = async (req, res) => {
  try {
    const { facultyName, seedFund } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const seedFundFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(seedFundFiles)];

    let marks = 0;
    if (seedFund === "upto one lakh") marks = 1;
    else if (seedFund === "greater than two lakh") marks = 2;
    else if (seedFund === " Research Publications ") marks = 1;

    const maxPass = pointsDistribution[designation]?.research?.seedfund ?? 0;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.seedFund = {
      value: "seedFund",
      marks: finalMarks,
      seedFundFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "seedFund",
      finalMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q13: Funded
exports.calculateFundedProjectMarks = async (req, res) => {
  try {
    const { facultyName, role, count } = req.body; 
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const projectCount = Number(count) || 0;

    const FundFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(FundFiles)];
    
    let marksPerProject = 0;
    if (role === "PI") marksPerProject = 5;
    else if (role === "COPI") marksPerProject = 2;

    const totalMarks = projectCount * marksPerProject;

    const maxPass = pointsDistribution[designation]?.research?.fund ?? totalMarks;
    const finalMarks = Math.min(totalMarks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.passPercentage = {
      value: "FundedProject",
      marks: finalMarks,
      fundedProjectFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "FundedProject",
      finalMarks,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Q14: Research Scholars 
exports.calculateResearchScholarMarks = async (req, res) => {
  try {
    const { facultyName, guidingCount, newlyRegisteredCount, completedCount } = req.body;
    const { designation } = req.params;

    if (!designation) {
      return res.status(400).json({ message: 'Designation missing in token' });
    }

    const scholarFiles = req.files?.map((file) => file.path) || [];
    const uniqueFiles = [...new Set(scholarFiles)];

    let marks = 0;

    if (Number(guidingCount) > 5) {
      marks += 3;
    }

    if (Number(newlyRegisteredCount) > 0) {
      const newRegMarks = Math.min(Number(newlyRegisteredCount) * 1, 2); // max 2 points
      marks += newRegMarks;
    }

    if (Number(completedCount) > 0) {
      marks += Number(completedCount) * 3;
    }

    const maxPass = pointsDistribution[designation]?.research?.researchScholars ?? marks;
    const finalMarks = Math.min(marks, maxPass);

    let record = await teaching.findOne({ facultyName, designation });
    if (!record) {
      record = new teaching({ facultyName, designation });
    }

    record.researchScholars = {
      value: "ResearchScholars",
      marks: finalMarks,
      researchScholarFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "ResearchScholars",
      finalMarks,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error calculating Research Scholar marks" });
  }
};



