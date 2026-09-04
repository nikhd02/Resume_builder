"use client";

import React from "react";
import type { OptimizedResumeResponse } from "@/types/resume";
import { TrendingUp, Zap, CheckCircle2, Lightbulb, Wand2, Loader2 } from "lucide-react";

interface ATSScoreProps {
  optimizedData: OptimizedResumeResponse | null;
  onAutoFix?: () => void;
  isOptimizing?: boolean;
}

export default function ATSScore({ optimizedData, onAutoFix, isOptimizing }: ATSScoreProps) {
  if (!optimizedData) return null;

  const score = optimizedData.atsScore;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-brand-400" />
        <h3 className="text-sm font-semibold text-white">ATS Match Score</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Score Ring */}
        <div className="score-ring flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              transform="rotate(-90 50 50)" className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}%</span>
          </div>
        </div>

        {/* Keywords */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-surface-300">Matched Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {optimizedData.extractedKeywords.slice(0, 8).map((kw, i) => (
              <span key={i} className="badge text-[10px]">{kw}</span>
            ))}
            {optimizedData.extractedKeywords.length > 8 && (
              <span className="badge text-[10px]">+{optimizedData.extractedKeywords.length - 8}</span>
            )}
          </div>
        </div>
      </div>

      {/* Skills to Highlight */}
      {optimizedData.skillsToHighlight.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-surface-300">Suggested Skills to Add</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {optimizedData.skillsToHighlight.map((s, i) => (
              <span key={i} className="badge-success text-[10px]">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Tips & Auto-Fix */}
      {optimizedData.improvementTips && optimizedData.improvementTips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-medium text-surface-300">How to improve your score</span>
          </div>
          <ul className="space-y-2 mb-4">
            {optimizedData.improvementTips.map((tip, i) => (
              <li key={i} className="text-xs text-surface-400 flex items-start gap-2">
                <span className="text-brand-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {onAutoFix && (
            <button
              onClick={onAutoFix}
              disabled={isOptimizing}
              className="w-full relative group overflow-hidden rounded-lg p-[1px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x" />
              <div className="relative bg-surface-900 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-surface-900/80">
                {isOptimizing ? (
                  <><Loader2 className="w-4 h-4 text-brand-400 animate-spin" /> <span className="text-sm font-medium text-white">Auto-Fixing...</span></>
                ) : (
                  <><Wand2 className="w-4 h-4 text-brand-400" /> <span className="text-sm font-medium text-white">Auto-Fix Resume (Target 90%+)</span></>
                )}
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
