const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse"); 
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up file handling in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend connected successfully");
});

// Main Analysis Endpoint
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: "Missing resume or job description" });
    }

    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();
    let resumeText = "";

    // ==========================================
    // 1. EXTRACT TEXT FROM THE FILE
    // ==========================================
    try {
      if (mimeType === "application/pdf" || originalName.endsWith(".pdf")) {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text;
      } 
      else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || originalName.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = result.value;
      } 
      else if (mimeType === "text/plain" || originalName.endsWith(".txt")) {
        resumeText = req.file.buffer.toString("utf-8");
      } 
      else {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." });
      }
    } catch (parseError) {
      console.error("File Extraction Error:", parseError);
      return res.status(400).json({ error: "Could not read text from this file. If it's a scanned image/PDF, try a text-based document." });
    }

    // Safety check: if the PDF was just an image, pdf-parse will return empty text
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "No readable text found in the file." });
    }

    // ==========================================
    // 2. SEND TO GROQ AI
    // ==========================================
    const prompt = `
      You are an expert technical IT recruiter. 
      Analyze the candidate resume against the Job Description.
      
      JOB DESCRIPTION: ${jobDescription}
      RESUME TEXT: ${resumeText}
      
      Return a JSON object with EXACTLY this structure (do not include any markdown or extra text):
      {
        "matchScore": <number between 0-100>,
        "summary": "<a short 2-sentence summary of the fit>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "missingSkills": ["<missing skill 1>", "<missing skill 2>"]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // The updated, lightning-fast model
      response_format: { type: "json_object" } // Forces pure JSON
    });

    // ==========================================
    // 3. RETURN RESULTS TO REACT
    // ==========================================
    const responseText = chatCompletion.choices[0].message.content;
    const analysisData = JSON.parse(responseText);

    res.json(analysisData);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze the resume on the server." });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});











// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const mammoth = require("mammoth");
// const dotenv = require("dotenv");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Load environment variables
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.get("/", (req, res) => {
//   res.send("Backend connected successfully");
// });

// app.post("/analyze", upload.single("resume"), async (req, res) => {
//   try {
//     const jobDescription = req.body.jobDescription;
    
//     if (!req.file || !jobDescription) {
//       return res.status(400).json({ error: "Missing resume or job description" });
//     }

//     const mimeType = req.file.mimetype;
//     let resumeContent;

//     // 1. Prepare the Resume Data
//     if (mimeType === "application/pdf") {
//       // Gemini can read PDFs natively via inline data!
//       resumeContent = {
//         inlineData: {
//           data: req.file.buffer.toString("base64"),
//           mimeType: "application/pdf"
//         }
//       };
//     } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//       const result = await mammoth.extractRawText({ buffer: req.file.buffer });
//       resumeContent = result.value;
//     } else if (mimeType === "text/plain") {
//       resumeContent = req.file.buffer.toString("utf-8");
//     } else {
//       return res.status(400).json({ error: "Unsupported file type." });
//     }

//     // 2. Prompt Engineering & AI Setup
//     // We use gemini-2.0-flash as it is fast and supports multimodal inputs (PDFs)
//     const model = genAI.getGenerativeModel({ 
//     model: "gemini-2.0-flash", // The lightweight, high-quota model
//     generationConfig: { responseMimeType: "application/json" }
//     });

//     const prompt = `
//       You are an expert technical IT recruiter. 
//       Analyze the provided candidate resume against this Job Description:
      
//       JOB DESCRIPTION:
//       ${jobDescription}
      
//       Evaluate the candidate and return a JSON object with EXACTLY this structure:
//       {
//         "matchScore": <number between 0-100>,
//         "summary": "<a short 2-sentence summary of the fit>",
//         "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
//         "missingSkills": ["<missing skill 1>", "<missing skill 2>"]
//       }
//     `;

//     // // 3. Send to AI
//     // // We pass both the prompt (text) and the resumeContent (which could be text or a PDF object)
//     // // const result = await model.generateContent([prompt, resumeContent]);

//     // // Temporarily sending a tiny text string instead of the massive file payload
//     // const dummyResume = "Candidate has 3 years of experience in React, Node.js, and API integration. Excellent frontend skills.";
//     // const result = await model.generateContent([prompt, dummyResume]);

    
//     // let responseText = result.response.text();

//     // // Clean up any Markdown formatting the AI might have accidentally added
//     // responseText = responseText.replace(/```json/gi, "").replace(/ ```/gi, "").trim();

//     // const analysisData = JSON.parse(responseText);

//     // // Send the structured data back to React
//     // res.json(analysisData);


//     // 3. Send to AI
//     let analysisData;
    
//     try {
//       // 1. Try the real AI first
//       const result = await model.generateContent([prompt, resumeContent]);
//       let responseText = result.response.text();
      
//       // Clean up markdown
//       responseText = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
//       analysisData = JSON.parse(responseText);
      
//     } catch (apiError) {
//       console.warn("Real AI failed (likely Quota 429). Using Mock AI Fallback...");
      
//       // 2. MOCK FALLBACK (If Google blocks the request)
//       // We simulate a 2-second "thinking" delay so the React loading spinner still shows
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       analysisData = {
//         matchScore: 82,
//         summary: "The candidate demonstrates strong foundational knowledge in the required tech stack. While they have excellent frontend capabilities, they may need minor onboarding for the specific backend architecture mentioned in the job description.",
//         strengths: ["Strong UI/UX implementation", "Excellent component architecture", "Clear communication style"],
//         missingSkills: ["Advanced Docker containerization", "Specific cloud deployment workflows"]
//       };
//     }

//     // Send the structured data back to React (either real or mocked!)
//     res.json(analysisData);

//   } 
  
//   catch (error) {
//     console.error("AI Analysis Error:", error);
//     res.status(500).json({ error: "Failed to analyze the resume" });
//   }
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });