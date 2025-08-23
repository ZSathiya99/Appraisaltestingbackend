const chromium = require('chrome-aws-lambda');
const teaching = require('../models/TeachingRecord');
const fs = require('fs');
const path = require('path');

exports.generateTeachingReportPDF = async (req, res) => {
  try {
    const { facultyName, designation } = req.body;
    if (!facultyName || !designation)
      return res.status(400).json({ message: 'facultyName and designation are required' });

    const record = await teaching.findOne({ facultyName, designation });
    if (!record) return res.status(404).json({ message: 'No record found for this faculty' });

    const recordObj = record.toObject();

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

    let rowsHTML = '';
    let totalMarks = 0;

    sections.forEach(section => {
      const data = recordObj[section.key];
      if (data && data.marks !== undefined) {
        rowsHTML += `<tr><td>${section.label}</td><td>${data.marks}</td></tr>`;
        totalMarks += Number(data.marks);
      }
    });

    const templatePath = path.join(__dirname, '../templates/teaching-report.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html
      .replace('{{facultyName}}', facultyName)
      .replace('{{designation}}', designation)
      .replace('{{date}}', new Date().toLocaleDateString())
      .replace('{{rows}}', rowsHTML)
      .replace('{{totalMarks}}', totalMarks);

    // Always use chrome-aws-lambda on Render
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${facultyName}-teaching-report.pdf"`
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating teaching report PDF:', err);
    res.status(500).json({ error: err.message });
  }
};
