const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();

app.use(cors());
app.use(express.json());

// Configure multer to hold the file in memory rather than saving it to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Backend connected successfully");
});

// The upload endpoint expects a form field named 'resume'
app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    let extractedText = "";
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();

    // 1. Handle PDF
    if (mimeType === "application/pdf" || originalName.endsWith(".pdf")) {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } 
    // 2. Handle DOCX
    else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      originalName.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
    } 
    // 3. Handle TXT
    else if (mimeType === "text/plain" || originalName.endsWith(".txt")) {
      // Node.js buffers can be directly converted to strings
      extractedText = req.file.buffer.toString("utf-8");
    } 
    // Handle Unsupported formats
    else {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." });
    }

    // Send the raw text back to the frontend to verify it worked
    res.json({ 
      message: "File parsed successfully", 
      text: extractedText 
    });

  } catch (error) {
    console.error("Error parsing file:", error);
    res.status(500).json({ error: "Failed to parse the file" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});