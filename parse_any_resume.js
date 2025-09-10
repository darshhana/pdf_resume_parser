import fs from "fs";
import path from "path";   // <-- for dynamic path
import pdfParse from "pdf-parse";
import ExcelJS from "exceljs";

//  Define dynamic folder paths (use __dirname for current folder)
const resumesFolder = path.join(process.cwd(), "resumes");   // "resumes" inside folder project
const outputFolder = path.join(process.cwd(), "output");

//  Make sure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

//  Input file path (example: Resume01.pdf inside resumes folder)
// const resumeFile = process.argv[2] ? path.join(process.cwd(), process.argv[2]) : path.join(process.cwd(), "Resume01.pdf");
const resumeFile = process.argv[2] ? path.join(process.cwd(), process.argv[2]) : path.join(process.cwd(), "Resume01.pdf")

//  Output Excel file
const outputFile = path.join(process.cwd(), `parsed_${path.basename(resumeFile, ".pdf")}.xlsx`);

//  Extract function
async function extractDetailsFromResume(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  const nameMatch = text.match(/(?:Name|Full Name|First Name|Last Name)[:\-]?\s*([A-Za-z\s\.]+)/i || text.match(/^([A-Za-z\s\.]+)$/m));
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}/);

  const skillsList = ["Python", "Java", "C++", "JavaScript", "HTML", "CSS", "SQL", "Node.js", "React", "AutoCAD", "SolidWorks", "Mechanical", "Engineering", "Design", "Manufacturing", "CNC", "CAD", "CAM", "Welding", "Machining"];
  const foundSkills = skillsList.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));

  const educationMatch = text.match(/(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|Bachelor|Master|Diploma)[^,\n]*/i);
  const experienceMatch = text.match(/(\d+)\s+(years?|yrs?)\s+of\s+experience/i) || text.match(/(\d+)\s+(months?|months?)\s+experience/i) || text.match(/experience[:\-]?\s*(\d+)/i);

  return {
    Name: nameMatch ? nameMatch[1].trim() : "Not Found",
    Email: emailMatch ? emailMatch[0] : "Not Found",
    Phone: phoneMatch ? phoneMatch[0] : "Not Found",
    Skills: foundSkills.length > 0 ? foundSkills.join(", ") : "Not Found",
    Education: educationMatch ? educationMatch[0] : "Not Found",
    Experience: experienceMatch ? experienceMatch[0] : "Not Found",
  };
}

//  Main function
(async () => {
  try {
    const details = await extractDetailsFromResume(resumeFile);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Resume Data");

    worksheet.columns = [
      { header: "Name", key: "Name", width: 30 },
      { header: "Email", key: "Email", width: 30 },
      { header: "Phone", key: "Phone", width: 20 },
      { header: "Skills", key: "Skills", width: 40 },
      { header: "Education", key: "Education", width: 30 },
      { header: "Experience", key: "Experience", width: 20 },
    ];

    worksheet.addRow(details);

    await workbook.xlsx.writeFile(outputFile);

    console.log(` Extraction completed for file: ${resumeFile}`);
    console.log(` Details saved in: ${outputFile}`);
  } catch (err) {
    console.error(" Error processing resume:", err);
  }
})();
