const teaching = require('../models/TeachingRecord');
const pointsDistribution = require("../utils/prePoints");


// Q1: SCIE
exports.calculateSciePaper = async (req, res) => {
  try {
    const { facultyName, scie, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;
    
    let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.sciePaper?.sciePaperFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let papers = scie;
    if (typeof scie === "string") {
      try {
        papers = JSON.parse(scie);
      } catch {
        return res.status(400).json({ error: "Invalid SCIE data format" });
      }
    }

    if (!Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "SCIE must be a non-empty array" });
    }

    let totalMarks = 0;
    papers.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 4;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 2;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 1;
    });

    const maxmark = pointsDistribution[designation]?.research?.scie ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);

    
   
    let parsedValue;
    try {
      parsedValue = Array.isArray(req.body.scie)
        ? req.body.scie
        : JSON.parse(req.body.scie);   
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON in value field" });
    }
    let parsedValue;
    try {
      parsedValue = Array.isArray(req.body.scie)
        ? req.body.scie
        : JSON.parse(req.body.scie);   
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON in value field" });
    }

    record.sciePaper = {
      value: parsedValue ?? null,
      marks: finalMarks,
      sciePaperFiles: uniqueFiles
    };
    await record.save();

    return res.status(200).json({
      section: "SCIE",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Q2: Scopus
exports.calculateScopusPaper = async (req, res) => {
  try {
    const { facultyName, scopus, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.scopusPaper?.scopusPaperFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];


    let papers = scopus;
    if (typeof scopus === "string") {
      try {
        papers = JSON.parse(scopus);
      } catch {
        return res.status(400).json({ error: "Invalid scopus data format" });
      }
    }

    if (!Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "scopus must be a non-empty array" });
    }

    let totalMarks = 0;
    papers.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 3;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 1.5;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 0.75;
    });

    const maxmark = pointsDistribution[designation]?.research?.scopus ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);

<<<<<<< HEAD
   
=======
    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }
    
>>>>>>> d9a592566d0de7d0e51d1e3fc9cfc69f777dd9ba

    record.scopusPaper = {
      value: scopus ?? null,
      marks: finalMarks,
      scopusPaperFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Scopus",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q3: Aicte
exports.calculateAictePaper = async (req, res) => {
  try {
    const { facultyName, aicte, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.aictePaper?.aictePaperFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let papers = aicte;
    if (typeof aicte === "string") {
      try {
        papers = JSON.parse(aicte);
      } catch {
        return res.status(400).json({ error: "Invalid aicte data format" });
      }
    }

    if (!Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "aicte must be a non-empty array" });
    }

    let totalMarks = 0;
    papers.forEach(paper => {
      if (paper.typeOfAuthor === "Firstauthor") totalMarks += 1;
      else if (paper.typeOfAuthor === "secondauthor") totalMarks += 0.5;
      else if (paper.typeOfAuthor === "thirdauthor") totalMarks += 0.75;
    });

    const maxmark = pointsDistribution[designation]?.research?.aicte ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);


    record.aictePaper = {
      value: aicte ?? null,
      marks: finalMarks,
      aictePaperFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Aicte",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q4: BookScopus
exports.calculateScopusBook = async (req, res) => {
  try {
    const { facultyName, numBook, employeeId, designation: bodyDesignation, scopusBookFiles: bodyFiles } = req.body;
    const { designation: paramDesignation } = req.params;

    // Determine designation
    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    const employee = (paramDesignation === "HOD" || paramDesignation === "Dean") 
      ? employeeId 
      : req.userId;

    let record = await teaching.findOne({ facultyName, employee });
    if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee, scopusBook: { scopusBookFiles: [] } });
    }

    let currentFiles = record.scopusBook?.scopusBookFiles || [];
    if (bodyFiles) {
      const bodyFilesArray = Array.isArray(bodyFiles) ? bodyFiles : [bodyFiles];
      bodyFilesArray.forEach(file => {
        if (!currentFiles.includes(file)) currentFiles.push(file);
      });
    }

    if (paramDesignation !== "HOD" && paramDesignation !== "Dean" && req.files?.length) {
      req.files.forEach(file => {
        const normalizedPath = file.path.replace(/\\/g, "/");
        console.log("New uploaded file:", normalizedPath);
        if (!currentFiles.includes(normalizedPath)) currentFiles.push(normalizedPath);
      });
    }

    const bookCount = Number(numBook) || 0;
    const marksPerBook = 2;
    const totalMarks = bookCount * marksPerBook;
    const maxMark = pointsDistribution[designation]?.research?.book_scopus ?? 0;
    const finalMarks = Math.min(totalMarks, maxMark);

    record.scopusBook = {
      value: numBook ?? null,
      marks: finalMarks,
      scopusBookFiles: currentFiles,
    };

    // Save record
    await record.save();

    // Return response with all current files
    return res.status(200).json({
      section: "ScopusBook",
      finalMarks,
      files: currentFiles,
      employee,
      designation
    });

  } catch (err) {
    console.error("Error in calculateScopusBook:", err);
    return res.status(500).json({ error: err.message });
  }
};


<<<<<<< HEAD



=======
>>>>>>> d9a592566d0de7d0e51d1e3fc9cfc69f777dd9ba
// Q5: IndexedBook
exports.calculateIndexedBook = async (req, res) => {
  try {
    const { facultyName, numPaper, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.indexBook?.indexBookFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    const paperCount = Number(numPaper) || 0;
    const marksPerPaper = 1;
    const totalMarks = paperCount * marksPerPaper;

    const maxmark = pointsDistribution[designation]?.research?.indexbook ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);


    record.indexBook = {
      value:numPaper,
      marks: finalMarks,
      indexBookFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "IndexBook",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q6: Patent
exports.calculatePatentMarks = async (req, res) => {
  try {
    const { facultyName, patentType, numPatent, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.patent?.patentFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    const patentCount = Number(numPatent) || 0;
    let marksPerPatent = 0;

    if (patentType === "Published") marksPerPatent = 1;
    else if (patentType === "Utilitygranted") marksPerPatent = 3;
    else if (patentType === "Designothers") marksPerPatent = 2;

    const totalMarks = patentCount * marksPerPatent;
    const maxmark = pointsDistribution[designation]?.research?.patent ?? 0;
    const finalMarks = Math.min(totalMarks, maxmark);


    record.patent = {
      value: patentType,
      marks: finalMarks,
      patentFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Patent",
      type: patentType,
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Q7: hindex
exports.calculatehIndex = async (req, res) => {
  try {
    const { facultyName, hindex, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.hIndex?.hIndexFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];


    let marks = 0;
    const num = Number(hindex);
    if ((typeof hindex === "string" && hindex.toLowerCase().includes("5")) || num >= 5) marks = 3;
    else if ((typeof hindex === "string" && hindex.includes("3")) || num === 3) marks = 2;
    else if ((typeof hindex === "string" && hindex.includes("2")) || num === 2) marks = 1;

    const maxmark = pointsDistribution[designation]?.research?.hindex ?? 0;
    const finalMarks = Math.min(marks, maxmark);

    record.hIndex = {
      value: hindex,
      marks: finalMarks,
      hIndexFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "HIndex",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q8: 10index
exports.calculateIIndex = async (req, res) => {
  try {
    const { facultyName, Iindex, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.iIndex?.iIndexFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let marks = 0;
    if (Iindex === "2 and above" || Number(Iindex) >= 2) marks = 2;
    else if (Number(Iindex) === 1) marks = 1;

    const maxmark = pointsDistribution[designation]?.research?.i10index ?? 0;
    const finalMarks = Math.min(marks, maxmark);


    record.iIndex = {
      value: Iindex,
      marks: finalMarks,
      iIndexFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "IIndex",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




// Q9: Citation
exports.calculateCitation = async (req, res) => {
  try {
    const { facultyName, citation, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.citation?.citationFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let marks = 0;
    if (citation === "100 and above" || Number(citation) >= 100) marks = 3;
    else if (citation === "50" || Number(citation) >= 50) marks = 2;
    else if (citation === "25" || Number(citation) >= 25) marks = 1;

    const maxmark = pointsDistribution[designation]?.research?.citation ?? 0;
    const finalMarks = Math.min(marks, maxmark);


    record.citation = {
      value: citation,
      marks: finalMarks,
      citationFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Citation",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




// Q10: Consultancy
exports.calculateConsultancy = async (req, res) => {
  try {
    const { facultyName, consultancy, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.consultancy?.consultancyFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let marks = 0;
    if (consultancy === "upto one lakh") marks = 2;
    else if (consultancy === "two lakh") marks = 3;
    else if (consultancy === "greater than five") marks = 4;

    const maxmark = pointsDistribution[designation]?.research?.consultancy ?? 0;
    const finalMarks = Math.min(marks, maxmark);


    record.consultancy = {
      value: consultancy,
      marks: finalMarks,
      consultancyFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Consultancy",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


//Q11: foreign 
exports.calculateForeignMarks = async (req, res) => {
  try {
    const { foreignWork, facultyName, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.collabrative?.collabrativeFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    const isYes = foreignWork?.toLowerCase() === 'yes';
    const marks = isYes ? 2 : 0;
    const maxmark = pointsDistribution[designation]?.research?.collabrative ?? 0;
    const finalMarks = Math.min(marks, maxmark);


    record.collabrative = {
      value: foreignWork,
      marks: finalMarks,
      collabrativeFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "Foreign/Collaborative Work",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Q12: SeedFund
exports.calculateSeedFund = async (req, res) => {
  try {
    const { facultyName, seedFund, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.seedFund?.seedFundFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let marks = 0;
    if (seedFund === "upto one lakh") marks = 1;
    else if (seedFund === "greater than two lakh") marks = 2;
    else if (seedFund === "Research Publications") marks = 1;

    const maxPass = pointsDistribution[designation]?.research?.seedfund ?? 0;
    const finalMarks = Math.min(marks, maxPass);


    record.seedFund = {
      value: seedFund,
      marks: finalMarks,
      seedFundFiles: uniqueFiles,
    };

    await record.save();

    return res.status(200).json({
      section: "SeedFund",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



// Q13: Funded
exports.calculateFundedProjectMarks = async (req, res) => {
  try {
    const { facultyName, field_name, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

    let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }

    const existingFiles = record.fundedProject?.fundedProjectFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let fieldData = field_name;
    if (typeof fieldData === "string") {
      try {
        fieldData = JSON.parse(fieldData);
      } catch (err) {
        console.error("Invalid JSON in field_name:", fieldData);
        fieldData = {};
      }
    }

    const piCount = Number(fieldData.PI) || 0;
    const copiCount = Number(fieldData.CoPI) || 0;

    const piMarks = 5;    
    const copiMarks = 2;  

    const totalMarks = (piCount * piMarks) + (copiCount * copiMarks);

    const maxPass = pointsDistribution[designation]?.research?.fund ?? totalMarks;
    const finalMarks = Math.min(totalMarks, maxPass);


    record.fundedProject = {
      value: "FundedProject",
      marks: finalMarks,
      fundedProjectFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "FundedProject",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (error) {
    console.error("Error calculating Funded Project marks:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




// Q14: Research Scholars 
exports.calculateResearchScholarMarks = async (req, res) => {
  try {
    const { facultyName, guidingCount, newlyRegisteredCount, completedCount, employeeId, designation: bodyDesignation } = req.body;
    const { designation: paramDesignation } = req.params;

    let designation;
    if (paramDesignation === "HOD" || paramDesignation === "Dean") {
      designation = bodyDesignation;
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required for HOD/Dean" });
      }
    } else {
      designation = paramDesignation;
    }

    if (!designation) {
      return res.status(400).json({ message: "Designation missing" });
    }

    let employee = (paramDesignation === "HOD" || paramDesignation === "Dean")
      ? employeeId
      : req.userId;

      let record = await teaching.findOne({ facultyName, employee });
     if (!record) {
      if (paramDesignation === "HOD" || paramDesignation === "Dean") {
        return res.status(404).json({
          message: "Faculty record not found. HOD/Dean can only edit existing records."
        });
      }
      record = new teaching({ facultyName, designation, employee });
    }
    const existingFiles = record.researchScholars?.researchScholarFiles || [];
    const newFiles = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];
    const uniqueFiles = [...new Set([...existingFiles, ...newFiles])];

    let marks = 0;
    if (Number(guidingCount) > 5) marks += 3;

    if (Number(newlyRegisteredCount) > 0) {
      marks += Math.min(Number(newlyRegisteredCount) * 1, 2); // max 2 points
    }

    if (Number(completedCount) > 0) {
      marks += Number(completedCount) * 3;
    }

    const maxPass = pointsDistribution[designation]?.research?.researchScholars ?? marks;
    const finalMarks = Math.min(marks, maxPass);


    record.researchScholars = {
      value: "ResearchScholars",
      marks: finalMarks,
      researchScholarFiles: uniqueFiles
    };

    await record.save();

    return res.status(200).json({
      section: "Research Scholars",
      finalMarks,
      files: uniqueFiles,
      employee,
      designation
    });

  } catch (error) {
    console.error("Error calculating Research Scholar marks:", error);
    return res.status(500).json({ message: "Error calculating Research Scholar marks", error: error.message });
  }
};




