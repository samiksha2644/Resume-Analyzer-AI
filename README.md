# 🚀 AI-Powered Resume Analyzer

A full-stack recruitment tool that instantly evaluates candidate fit by comparing uploaded resumes directly against target job descriptions. It leverages open-source LLMs to generate a real-time match score, an executive summary, and a clear breakdown of strengths and skill gaps.

---

## 💡 Why This Project?

This application demonstrates a practical, complete pipeline from frontend UI to backend file processing and AI integration. It highlights:
* **Full-Stack Architecture:** Seamless data flow between a React frontend and an Express backend.
* **Complex File Handling:** In-memory processing and text extraction for PDF and DOCX formats without touching the server's hard drive.
* **AI API Integration:** Prompt engineering and structured JSON enforcement using the Groq API (Llama 3.1) for lightning-fast analysis.
* **Graceful Degradation:** Built-in error handling for API rate limits and unsupported file types.

---

## ✨ Current Features

* **Smart Document Upload:** Drag-and-drop or click-to-upload support for PDF, DOCX, and TXT files.
* **Robust Text Extraction:** Utilizes `pdf-parse` and `mammoth` to reliably pull text data from candidate resumes.
* **Job Description Comparison:** Direct mapping of candidate experience against pasted job requirements.
* **ATS Compatibility Scoring:** Generates a real-time percentage match score simulating enterprise Applicant Tracking Systems.
* **Skill-Gap Visualization:** A responsive, side-by-side dashboard that clearly identifies matching strengths and missing skills.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** - Dynamic, state-driven UI
* **Tailwind CSS** - Modern, responsive grid layouts and styling
* **Lucide React** - Clean, scalable iconography

### Backend & Processing
* **Node.js & Express.js** - RESTful API routing
* **Multer** - Middleware for handling multipart/form-data and in-memory file buffering
* **pdf-parse & mammoth** - Document parsing tools for extracting raw text from PDFs and Word documents

### AI Integration
* **Groq SDK (Llama-3.1-8b-instant)** - Ultra-fast LLM API utilized for semantic comparison, configured to return strictly formatted JSON objects. *(Easily swappable to Google Gemini/OpenAI).*

---

## 🚀 Setup & Installation

### Clone this repository
```bash
git clone https://github.com/samiksha2644/Resume-Analyzer-AI.git
```

### Setup the Backend
```bash
cd backend
npm install
# Create a .env file and add: GROQ_API_KEY=your_api_key_here
node server.js
```

### Setup the Frontend
```bash
# Open a new terminal window
npm install
npm start
```

---

## 🔮 Future Architecture Improvements

While the current version relies on an LLM for analysis, the roadmap includes scaling this into a fully authenticated, machine-learning-driven platform:

* **Database Integration (MongoDB & JWT):** Implement secure user accounts allowing recruiters to save, track, and revisit past candidate analyses.
* **Python ML Microservice:** Introduce a dedicated backend service utilizing **TensorFlow** or **Scikit-learn** to run custom NLP skill classification models locally.
* **Semantic Similarity Scoring:** Replace basic LLM prompt evaluation with advanced vector embeddings to mathematically score semantic similarity between resumes and job descriptions.
* **Bulk Processing Dashboard:** Allow users to upload a `.zip` file of 50+ resumes, instantly extract all text, and rank candidates on a leaderboard against a single job description.
* **Web Scraping:** Allow recruiters to paste a LinkedIn or Indeed URL to automatically scrape job requirements instead of manual copy-pasting.

---

*Designed and developed by Samiksha Mukund Mote*
