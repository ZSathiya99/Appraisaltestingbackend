const PDFDocument = require('pdfkit');
const TeachingRecord = require('../models/TeachingRecord');
const Employee = require('../models/Employee');

exports.generateTeachingReportPDF = async (req, res) => {
  try {
    const { facultyName, designation } = req.body;
    if (!facultyName || !designation) {
      return res.status(400).json({ message: 'facultyName and designation are required' });
    }

    // Find the teaching record
    const record = await TeachingRecord.findOne({ facultyName, designation }).populate('employee');
    if (!record) return res.status(404).json({ message: 'No record found for this faculty' });

    // Mark the teaching record as submitted
    record.isSubmitted = true;
    await record.save();

    // Update the employee formStatus
    if (record.employee) {
      await Employee.findByIdAndUpdate(record.employee._id, { formStatus: 'Submitted' });
    }

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${facultyName}-teaching-report.pdf"`);

    doc.pipe(res); // Pipe PDF to response

    // Title
    doc.fontSize(20).text('Teaching Record Submission', { align: 'center' });
    doc.moveDown();

    // Employee details
    doc.fontSize(12).text(`Faculty Name: ${facultyName}`);
    doc.text(`Designation: ${designation}`);
    doc.text(`Department: ${record.employee?.department || 'N/A'}`);
    doc.text(`Email: ${record.employee?.email || 'N/A'}`);
    doc.text(`Form Status: Submitted`);
    doc.moveDown();

    // Table-like content for marks
    const sections = [
      { key: 'teachingAssignment', label: 'Teaching Assignment' },
      { key: 'passPercentage', label: 'Pass Percentage' },
      { key: 'feedback', label: 'Student Feedback' },
      { key: 'innovativeApproach', label: 'Innovative Approach' },
      { key: 'visitingFaculty', label: 'Guest Lectures' },
      { key: 'fdpFunding', label: 'FDP Funding' },
      { key: 'innovationProject', label: 'Innovation Project' },
      { key: 'fdp', label: 'FDP Programme' },
      { key: 'industry', label: 'Industry Involvement' },
      { key: 'tutorMeeting', label: 'Tutor-Ward Meeting' },
      { key: 'academicPosition', label: 'Academic Roles' }
    ];

    let totalMarks = 0;
    doc.fontSize(12).text('Marks:', { underline: true });
    doc.moveDown(0.5);

    sections.forEach(section => {
      const data = record[section.key];
      if (data && data.marks !== undefined) {
        doc.text(`${section.label}: ${data.marks}`);
        totalMarks += Number(data.marks);
      }
    });

    doc.moveDown();
    doc.text(`Total Marks: ${totalMarks}`, { bold: true });

    doc.end(); // Finalize PDF
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Server error while generating PDF' });
  }
};
