"use client";

import React from "react";
import { Target, Sparkles } from "lucide-react";

interface JobDescriptionFormProps {
  data: string;
  onChange: (data: string) => void;
}

export default function JobDescriptionForm({ data, onChange }: JobDescriptionFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/25">
          <Target className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Target Job Description</h2>
          <p className="text-sm text-surface-400">Paste the full job description to optimize your resume</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-surface-300">
            AI will extract keywords and tailor your resume to this JD
          </span>
        </div>
        <textarea
          className="form-textarea"
          rows={16}
          placeholder={`Paste the full job description here...\n\nExample:\nWe are looking for a Senior Software Engineer with experience in React, Node.js, and AWS. The ideal candidate will have:\n- 5+ years of experience in full-stack development\n- Strong understanding of microservices architecture\n- Experience with CI/CD pipelines\n- Excellent communication skills\n...`}
          value={data}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-surface-500">{data.length} characters</p>
          {data.length > 100 && (
            <span className="badge-success text-xs">✓ Good length for analysis</span>
          )}
        </div>
      </div>

      <div className="glass-card p-4 border-brand-500/20">
        <h3 className="text-sm font-semibold text-brand-300 mb-2">🎯 How AI Optimization Works</h3>
        <ul className="space-y-1.5 text-xs text-surface-400">
          <li>• <strong className="text-surface-300">Keyword Extraction:</strong> Identifies key skills, tools, and requirements</li>
          <li>• <strong className="text-surface-300">XYZ Formula:</strong> Rewrites bullets as &quot;Accomplished X using Y as measured by Z&quot;</li>
          <li>• <strong className="text-surface-300">ATS Scoring:</strong> Rates how well your resume matches the job posting</li>
          <li>• <strong className="text-surface-300">Summary Tailoring:</strong> Generates a targeted professional summary</li>
        </ul>
      </div>
    </div>
  );
}
