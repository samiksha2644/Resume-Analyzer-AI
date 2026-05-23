import React, { useState } from "react";
import { UploadCloud, FileText, Sparkles, AlertCircle, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function ContentAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const analysisResult = await response.json();
      setAnalysis(analysisResult);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center px-4 py-12">
      {/* WIDENED CONTAINER: max-w-6xl */}
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        {/* Header (Centered at the top) */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Upload a candidate's resume and paste the target job description. Our AI will instantly evaluate the match, highlighting key strengths and missing skills.
          </p>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: INPUTS                        */}
          {/* ========================================== */}
          <div className="flex flex-col space-y-6">
            
            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl animate-in fade-in">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Upload Area */}
            <div>
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
                <div className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <FileText size={18} />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
              )}
            </div>

            {/* Text Area */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                2. Paste Job Description
              </label>
              <textarea
                rows="8"
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
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex justify-center items-center gap-2 mt-auto
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

          {/* ========================================== */}
          {/* RIGHT COLUMN: RESULTS                      */}
          {/* ========================================== */}
          <div className="bg-black/20 border border-white/5 rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
            
            {/* 1. Empty State (Before Analysis) */}
            {!analysis && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <LayoutDashboard className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">Awaiting Input</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Upload a candidate's resume and job description on the left to generate a detailed AI match report here.
                </p>
              </div>
            )}

            {/* 2. Loading State */}
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-pulse">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-medium text-blue-400 mb-2">AI is analyzing the profile...</h3>
                <p className="text-gray-500 text-sm">Comparing skills, experience, and requirements.</p>
              </div>
            )}

            {/* 3. Analysis Dashboard */}
            {analysis && !isLoading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Analysis Results
                </h2>

                <div className="flex flex-col gap-4 mb-6">
                  {/* Match Score Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium mb-2">Overall Match Score</span>
                    <div className={`text-6xl font-bold ${
                      analysis.matchScore >= 80 ? "text-green-400" : 
                      analysis.matchScore >= 60 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {analysis.matchScore}%
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <span className="text-gray-400 text-sm font-medium mb-2 block">Executive Summary</span>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {analysis.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Strengths */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                    <h3 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Areas to Improve
                    </h3>
                    <ul className="space-y-2">
                      {analysis.missingSkills.map((skill, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}