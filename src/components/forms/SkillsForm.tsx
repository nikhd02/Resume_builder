"use client";

import React, { useState } from "react";
import type { SkillsData } from "@/types/resume";
import { Wrench, Heart, Award, Languages, Plus, X } from "lucide-react";

interface SkillsFormProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

type SkillCategory = keyof SkillsData;

const categories: { key: SkillCategory; label: string; icon: React.ReactNode; placeholder: string; color: string }[] = [
  { key: "technical", label: "Technical Skills", icon: <Wrench className="w-4 h-4" />, placeholder: "e.g. React, Python, AWS", color: "brand" },
  { key: "soft", label: "Soft Skills", icon: <Heart className="w-4 h-4" />, placeholder: "e.g. Leadership, Communication", color: "purple" },
  { key: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" />, placeholder: "e.g. AWS Solutions Architect", color: "emerald" },
  { key: "languages", label: "Languages", icon: <Languages className="w-4 h-4" />, placeholder: "e.g. English (Native), Hindi", color: "amber" },
];

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [inputs, setInputs] = useState<Record<SkillCategory, string>>({ technical: "", soft: "", certifications: "", languages: "" });

  const addSkill = (category: SkillCategory) => {
    const val = inputs[category].trim();
    if (!val || data[category].includes(val)) return;
    onChange({ ...data, [category]: [...data[category], val] });
    setInputs({ ...inputs, [category]: "" });
  };

  const removeSkill = (category: SkillCategory, index: number) => {
    onChange({ ...data, [category]: data[category].filter((_, i) => i !== index) });
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: SkillCategory) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(category); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25">
          <Wrench className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Skills & Certifications</h2>
          <p className="text-sm text-surface-400">Add skills that match the target job description</p>
        </div>
      </div>

      {categories.map(({ key, label, icon, placeholder }) => (
        <div key={key} className="glass-card p-5">
          <label className="form-label flex items-center gap-2 mb-3">{icon} {label}</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="form-input flex-1"
              placeholder={placeholder}
              value={inputs[key]}
              onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, key)}
            />
            <button type="button" onClick={() => addSkill(key)} className="btn-secondary px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data[key].map((skill, i) => (
              <span key={i} className="skill-tag group">
                {skill}
                <button type="button" onClick={() => removeSkill(key, i)} className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {data[key].length === 0 && (
              <span className="text-xs text-surface-500 italic">No {label.toLowerCase()} added yet. Press Enter or click + to add.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
