const PDFDocument = require('pdfkit');

exports.generateFacultyReportPDF = async (req, res) => {
  try {
    const { facultyName, designation } = req.body;

    if (!facultyName) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const record = await teaching.findOne({ facultyName, designation });

    if (!record) {
      return res.status(404).json({ message: "No record found" });
    }

    // Set PDF headers
    res.setHeader('Content-Disposition', 'attachment; filename="faculty-report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(24).text('Faculty Performance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Faculty Name: ${facultyName}`);
    doc.text(`Designation: ${designation}`);
    doc.moveDown();

    // Sections
    const addSection = (title, value, marks) => {
      doc.fontSize(14).text(title, { underline: true });
      doc.fontSize(12).text(`Value: ${value}`);
      doc.text(`Marks: ${marks}`);
      doc.moveDown();
    };

    const sections = [
      { title: "Teaching Assignment", field: record.teachingAssignment },
      { title: "Pass Percentage", field: record.passPercentage },
      { title: "Student Feedback", field: record.feedback },
      { title: "Innovative Approach", field: record.innovativeApproach },
      { title: "Guest Lecture", field: record.visitingFaculty },
      { title: "FDP Funding", field: record.fdpFunding },
      { title: "High Level Competition", field: record.innovationProject },
      { title: "FDP Program", field: record.fdp },
      { title: "Industry Involvement", field: record.industry },
      { title: "Tutor Ward Meeting", field: record.tutorMeeting },
      { title: "Roles in Academic", field: record.academicPosition },
      { title: "Student Projects & Publications", field: record.studentProjectsAndPublications },
    ];

    sections.forEach(({ title, field }) => {
      if (field) {
        addSection(title, field.value || '-', field.marks || 0);
      }
    });

    // Total Marks
    const sumMarks = (fields) => fields.reduce((total, f) => total + (f && f.marks ? f.marks : 0), 0);

    const teachingFields = [
      record.teachingAssignment, record.passPercentage, record.feedback, record.innovativeApproach,
      record.visitingFaculty, record.studentProject, record.fdpFunding, record.innovationProject,
      record.fdp, record.industry, record.tutorMeeting, record.academicPosition
    ];

    const researchFields = [
      record.sciePaper, record.scopusPaper, record.aictePaper, record.scopusBook, record.indexBook,
      record.hIndex, record.iIndex, record.citation, record.consultancy, record.collabrative,
      record.seedFund, record.patent, record.fundedProject, record.researchScholars
    ];

    const serviceFields = [
      record.activities, record.branding, record.membership, record.external,
      record.administration, record.training
    ];

    const teachingMarks = sumMarks(teachingFields);
    const researchMarks = sumMarks(researchFields);
    const serviceMarks = sumMarks(serviceFields);
    const totalMarks = teachingMarks + researchMarks + serviceMarks;

    doc.moveDown();
    doc.fontSize(16).text('Summary', { underline: true });
    doc.fontSize(12).text(`Teaching Marks: ${teachingMarks}`);
    doc.text(`Research Marks: ${researchMarks}`);
    doc.text(`Service Marks: ${serviceMarks}`);
    doc.text(`Total Marks: ${totalMarks}`);

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
