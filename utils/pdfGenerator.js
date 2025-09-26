const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePdf = async (record, employee) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfFolder = path.join(__dirname, "..", "uploads", "pdfs");

      if (!fs.existsSync(pdfFolder)) {
        fs.mkdirSync(pdfFolder, { recursive: true });
      }

      const fileName = `${employee.fullName.replace(/\s+/g, "_")}_${record._id}.pdf`;
      const filePath = path.join(pdfFolder, fileName);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ✅ Example PDF content
      doc.fontSize(18).text("Teaching Record", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${employee.fullName}`);
      doc.text(`Email: ${employee.email}`);
      doc.text(`Department: ${employee.department}`);
      doc.text(`Designation: ${employee.designation}`);
      doc.text(`Approval Status: ${record.approvalStatus}`);
      doc.text(`Form Status: ${employee.formStatus}`);
      doc.text(`Record ID: ${record._id}`);

      doc.end();

      stream.on("finish", () => resolve(filePath));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generatePdf };
