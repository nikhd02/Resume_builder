"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { UserData, FormTab, OptimizedResumeResponse, ResumeTemplate } from "@/types/resume";
import { defaultUserData } from "@/lib/defaults";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import SkillsForm from "@/components/forms/SkillsForm";
import JobDescriptionForm from "@/components/forms/JobDescriptionForm";
import ResumePreview from "@/components/preview/ResumePreview";
import ATSScore from "@/components/preview/ATSScore";
import PDFDownloadButton from "@/components/pdf/PDFDownloadButton";
import {
  User, Briefcase, GraduationCap, Wrench, Target,
  Sparkles, Loader2, RotateCcw, FileText, ChevronRight, ChevronLeft, Zap,
} from "lucide-react";

const tabs: { key: FormTab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "personal", label: "Personal Info", icon: <User className="w-4 h-4" />, color: "brand" },
  { key: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" />, color: "purple" },
  { key: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" />, color: "emerald" },
  { key: "skills", label: "Skills", icon: <Wrench className="w-4 h-4" />, color: "amber" },
  { key: "job-description", label: "Job Description", icon: <Target className="w-4 h-4" />, color: "teal" },
];

export default function HomePage() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [activeTab, setActiveTab] = useState<FormTab>("personal");
  const [optimizedData, setOptimizedData] = useState<OptimizedResumeResponse | null>(null);
  const [template, setTemplate] = useState<ResumeTemplate>("classic");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    setUserData(saved);
    setMounted(true);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (mounted) saveToLocalStorage(userData);
  }, [userData, mounted]);

  const handleOptimize = useCallback(async (autoFix = false) => {
    if (!userData.jobDescription || userData.jobDescription.trim().length < 50) {
      setError("Please paste a detailed job description (at least 50 characters) in the Job Description tab.");
      return;
    }
    setIsOptimizing(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData, jobDescription: userData.jobDescription, autoFix }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to optimize resume");
      }
      const data = await res.json();
      setOptimizedData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsOptimizing(false);
    }
  }, [userData]);

  const handleReset = () => {
    if (confirm("Are you sure? This will clear all your data.")) {
      setUserData(defaultUserData);
      setOptimizedData(null);
      setError(null);
    }
  };

  const currentTabIndex = tabs.findIndex((t) => t.key === activeTab);
  const goNext = () => { if (currentTabIndex < tabs.length - 1) setActiveTab(tabs[currentTabIndex + 1].key); };
  const goPrev = () => { if (currentTabIndex > 0) setActiveTab(tabs[currentTabIndex - 1].key); };

  const renderForm = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm data={userData.personalInfo} onChange={(d) => setUserData({ ...userData, personalInfo: d })} />;
      case "experience":
        return <ExperienceForm data={userData.experience} onChange={(d) => setUserData({ ...userData, experience: d })} />;
      case "education":
        return <EducationForm data={userData.education} onChange={(d) => setUserData({ ...userData, education: d })} />;
      case "skills":
        return <SkillsForm data={userData.skills} onChange={(d) => setUserData({ ...userData, skills: d })} />;
      case "job-description":
        return <JobDescriptionForm data={userData.jobDescription} onChange={(d) => setUserData({ ...userData, jobDescription: d })} />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface-950/80 border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-lg shadow-brand-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                ATS Resume <span className="text-gradient">Builder</span>
              </h1>
              <p className="text-[11px] text-surface-500 -mt-0.5">AI-Powered · 100% ATS Optimized</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-ghost flex items-center gap-1.5 text-sm">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={() => handleOptimize(false)}
              disabled={isOptimizing}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {isOptimizing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> AI Optimize</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Form Panel */}
          <div className="w-full lg:w-[55%] xl:w-[50%]">
            {/* Tab Navigation */}
            <div className="glass-card p-1.5 mb-6">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`tab-button whitespace-nowrap flex-1 min-w-0 justify-center ${activeTab === tab.key ? "active" : ""}`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-1 mb-4">
              {tabs.map((tab, i) => (
                <React.Fragment key={tab.key}>
                  <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentTabIndex ? "bg-brand-500" : "bg-white/[0.06]"}`} />
                </React.Fragment>
              ))}
            </div>

            {/* Form Content */}
            <div className="glass-card p-6">
              {renderForm()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={goPrev}
                  disabled={currentTabIndex === 0}
                  className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {currentTabIndex < tabs.length - 1 ? (
                  <button onClick={goNext} className="btn-primary flex items-center gap-2 text-sm">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleOptimize(false)}
                    disabled={isOptimizing}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    {isOptimizing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Optimize with AI</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview Panel */}
          <div className="w-full lg:w-[45%] xl:w-[50%]">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* ATS Score */}
              <ATSScore 
                optimizedData={optimizedData} 
                onAutoFix={() => handleOptimize(true)} 
                isOptimizing={isOptimizing} 
              />

              {/* Preview Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-surface-400" />
                  <h2 className="text-sm font-semibold text-surface-300">Live Preview</h2>
                  {optimizedData && (
                    <span className="badge text-[10px]">✨ AI Optimized</span>
                  )}
                </div>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
                  className="bg-surface-800 border border-white/[0.1] text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500"
                >
                  <option value="classic">Classic Corporate</option>
                  <option value="modern">Modern Tech</option>
                  <option value="compact">Compact Professional</option>
                </select>
              </div>

              {/* Resume Preview */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-b from-brand-500/10 to-transparent rounded-2xl blur-xl" />
                <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/50 border border-white/[0.06]">
                  <div className="max-h-[700px] overflow-y-auto">
                    <ResumePreview userData={userData} optimizedData={optimizedData} template={template} />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <PDFDownloadButton userData={userData} optimizedData={optimizedData} template={template} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] mt-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-surface-600">
            ATS Resume Builder · 100% Client-Side · No Data Stored on Servers · Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}
