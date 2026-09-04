"use client";

import React from "react";
import type { EducationItem } from "@/types/resume";
import { createDefaultEducation } from "@/lib/defaults";
import { GraduationCap, Building2, MapPin, Calendar, Award, BookOpen, Plus, Trash2, GripVertical } from "lucide-react";

interface EducationFormProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const updateItem = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addEducation = () => onChange([...data, createDefaultEducation()]);
  const removeEducation = (index: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Education</h2>
            <p className="text-sm text-surface-400">Your academic qualifications</p>
          </div>
        </div>
        <button type="button" onClick={addEducation} className="btn-secondary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {data.map((edu, index) => (
        <div key={edu.id} className="glass-card p-5 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-surface-600" />
              <span className="text-sm font-medium text-surface-400">Education {index + 1}</span>
            </div>
            {data.length > 1 && (
              <button type="button" onClick={() => removeEducation(index)} className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Degree *</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input type="text" className="form-input pl-10" placeholder="B.S. Computer Science" value={edu.degree} onChange={(e) => updateItem(index, "degree", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="form-label">Institution *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input type="text" className="form-input pl-10" placeholder="Stanford University" value={edu.institution} onChange={(e) => updateItem(index, "institution", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input type="text" className="form-input pl-10" placeholder="Stanford, CA" value={edu.location} onChange={(e) => updateItem(index, "location", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="form-label">Graduation Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input type="text" className="form-input pl-10" placeholder="May 2020" value={edu.graduationDate} onChange={(e) => updateItem(index, "graduationDate", e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <label className="form-label flex items-center gap-2"><Award className="w-4 h-4" /> GPA (optional)</label>
            <input type="text" className="form-input" placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => updateItem(index, "gpa", e.target.value)} />
          </div>
          <div>
            <label className="form-label flex items-center gap-2"><BookOpen className="w-4 h-4" /> Relevant Coursework</label>
            <input type="text" className="form-input" placeholder="Data Structures, Algorithms, ML" value={edu.relevantCoursework} onChange={(e) => updateItem(index, "relevantCoursework", e.target.value)} />
            <p className="mt-1.5 text-xs text-surface-500">Separate courses with commas</p>
          </div>
        </div>
      ))}
    </div>
  );
}
