import React, { useState } from "react";
import { UploadCloud, FileText, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ContentAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [extractedResume, setExtractedResume] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null); 
    setExtractedResume(""); // Reset extracted text if they upload a new file
  };

  const handleAnalyze = async () => {
    // We need both a resume and a job description to do an analysis
    if (!file || !jobDescription) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let currentResumeText = extractedResume;

      // Only parse the file if we haven't already extracted it
      if (file && !currentResumeText) {
        const formData = new FormData();
        formData.append("resume", file); 

        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to parse file on the server");
        }

        const data = await response.json();
        currentResumeText = data.text;
        setExtractedResume(currentResumeText);
      }

      // Day 2 Complete: We now have BOTH pieces of text ready for Day 3!
      console.log("Day 2 Successful! Ready for AI Analysis.");
      console.log("Job Description Length:", jobDescription.length);
      console.log("Extracted Resume Length:", currentResumeText.length);
      
      // TODO (Day 3): Send `currentResumeText` and `jobDescription` to your AI backend endpoint

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center px-4 py-8">
      
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-400 text-sm">
            Upload a resume and paste a job description to see how well they match.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">
            1. Upload Candidate Resume
          </label>
          <label
            htmlFor="file-upload"
            className="group flex flex-col items-center justify-center w-full h-40 border border-dashed border-gray-600 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-blue-500/10 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-white font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-gray-500 text-sm mt-1">
                PDF, DOCX, TXT supported
              </p>
            </div>

            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2 text-green-400">
                <FileText size={18} />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              {extractedResume && <CheckCircle2 size={18} className="text-green-500" />}
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">
            2. Paste Job Description
          </label>
          <textarea
            rows="6"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description requirements here..."
            className="w-full bg-white/5 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || !jobDescription || isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex justify-center items-center gap-2
            ${
              !file || !jobDescription || isLoading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
              Parsing & Analyzing...
            </>
          ) : (
            "Analyze Match"
          )}
        </button>
      </div>
    </div>
  );
}