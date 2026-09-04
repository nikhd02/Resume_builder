"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Target, UploadCloud, ChevronLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ATSResult {
  score: number;
  status: string;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
}

export default function CheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleCheck = async () => {
    if (!file || !jobDescription) {
      setError("Please upload a PDF and enter a Job Description.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setResult(null);

    try {
      // 1. Extract text from PDF
      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!parseRes.ok) throw new Error("Failed to parse PDF.");
      const { text } = await parseRes.json();

      if (!text || text.trim().length < 50) {
        throw new Error("Could not extract enough text from the PDF. Is it an image-based PDF?");
      }

      // 2. Score with Gemini
      const scoreRes = await fetch("/api/check-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription }),
      });

      if (!scoreRes.ok) throw new Error("Failed to generate ATS score.");
      const scoreData = await scoreRes.json();

      setResult(scoreData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface-950/80 border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-surface-400 hover:text-white transition">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="font-bold tracking-wide">ATS Checker</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Check Your <span className="text-gradient">ATS Score</span>
          </h1>
          <p className="text-surface-400 max-w-[600px] mx-auto">
            Upload your existing PDF resume and paste the job description you're applying for. Our AI will grade your resume and give you actionable feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="form-label">1. Upload Resume (PDF)</label>
              <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-500/50 transition-colors bg-white/[0.02]">
                <UploadCloud className="w-10 h-10 text-surface-400 mb-4" />
                <p className="text-sm text-surface-300 mb-4">
                  {file ? file.name : "Drag and drop your PDF here, or click to browse"}
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-surface-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-brand-500/10 file:text-brand-400
                    hover:file:bg-brand-500/20 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="form-label">2. Target Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="form-textarea h-48"
              />
            </div>

            {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">{error}</div>}

            <button
              onClick={handleCheck}
              disabled={isProcessing || !file || !jobDescription}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                "Scan My Resume"
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="glass-card p-6 relative overflow-hidden">
            {!result && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-surface-900/50 backdrop-blur-sm z-10">
                <FileText className="w-12 h-12 text-surface-600 mb-4" />
                <h3 className="text-lg font-medium text-surface-300">Awaiting Scan</h3>
                <p className="text-sm text-surface-500 max-w-[250px]">
                  Upload your resume and click scan to see your detailed ATS report here.
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900/80 backdrop-blur-md z-10">
                <div className="score-ring w-24 h-24 rounded-full border-4 border-surface-700 border-t-brand-500 animate-spin mb-4" />
                <p className="text-brand-400 font-medium animate-pulse">Running ATS Parser...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Score: {result.score}%</h2>
                    <span className={`badge ${result.score >= 80 ? 'badge-success' : 'badge-warning'}`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-bold"
                    style={{ borderColor: result.score >= 80 ? '#10b981' : '#f59e0b' }}>
                    {result.score}
                  </div>
                </div>

                <div>
                  <h3 className="text-emerald-400 font-medium flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Top Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-surface-300 pl-4 border-l-2 border-emerald-500/30">{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-red-400 font-medium flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4" /> Missing Keywords / Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-surface-300 pl-4 border-l-2 border-red-500/30">{w}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-amber-400 font-medium flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4" /> AI Recommendations
                  </h3>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 space-y-3">
                    {result.improvementTips.map((tip, i) => (
                      <p key={i} className="text-sm text-surface-300 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span> {tip}
                      </p>
                    ))}
                  </div>
                </div>
                
                {result.score < 80 && (
                   <div className="mt-6 p-4 bg-brand-500/10 rounded-xl border border-brand-500/20 text-center">
                     <p className="text-sm text-surface-300 mb-3">Want to instantly fix these issues and get a 90%+ score?</p>
                     <Link href="/builder" className="btn-primary inline-flex py-2 px-6">
                        Use AI Builder
                     </Link>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
