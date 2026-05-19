import React, { useState } from "react";
import { UploadCloud, FileText, Sparkles } from "lucide-react";

export default function ContentAnalyzer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleAnalyze = () => {
    console.log("Analyzing...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center px-4">
      
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            AI Content Analyzer
          </h1>

          <p className="text-gray-400 text-sm">
            Upload files or paste text to generate intelligent analysis instantly.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="group flex flex-col items-center justify-center w-full h-52 border border-dashed border-gray-600 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-blue-400" />
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
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl">
              <FileText size={18} />
              <span className="text-sm">{file.name}</span>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">
            Paste your content
          </label>

          <textarea
            rows="7"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here for AI-powered analysis..."
            className="w-full bg-white/5 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!text && !file}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300
            ${
              !text && !file
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
            }
          `}
        >
          Analyze Content
        </button>
      </div>
    </div>
  );
}