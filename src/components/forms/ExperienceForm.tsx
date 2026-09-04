"use client";

import React from "react";
import type { ExperienceItem } from "@/types/resume";
import { createDefaultExperience } from "@/lib/defaults";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";

interface ExperienceFormProps {
  data: ExperienceItem[];
  onChange: (data: ExperienceItem[]) => void;
}

export default function ExperienceForm({
  data,
  onChange,
}: ExperienceFormProps) {
  const updateItem = (
    index: number,
    field: keyof ExperienceItem,
    value: string | boolean | string[]
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addExperience = () => {
    onChange([...data, createDefaultExperience()]);
  };

  const removeExperience = (index: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== index));
  };

  const addBullet = (expIndex: number) => {
    const updated = [...data];
    updated[expIndex] = {
      ...updated[expIndex],
      bullets: [...updated[expIndex].bullets, ""],
    };
    onChange(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data];
    const bullets = [...updated[expIndex].bullets];
    bullets[bulletIndex] = value;
    updated[expIndex] = { ...updated[expIndex], bullets };
    onChange(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...data];
    const bullets = updated[expIndex].bullets.filter(
      (_, i) => i !== bulletIndex
    );
    updated[expIndex] = {
      ...updated[expIndex],
      bullets: bullets.length === 0 ? [""] : bullets,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/25">
            <Briefcase className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Work Experience
            </h2>
            <p className="text-sm text-surface-400">
              Add your professional experience, most recent first
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {data.map((exp, expIndex) => (
        <div
          key={exp.id}
          className="glass-card p-5 space-y-4 animate-slide-up"
          style={{ animationDelay: `${expIndex * 0.1}s` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-surface-600" />
              <span className="text-sm font-medium text-surface-400">
                Position {expIndex + 1}
              </span>
            </div>
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(expIndex)}
                className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Job Title *</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Senior Software Engineer"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateItem(expIndex, "jobTitle", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label className="form-label">Company *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Google"
                  value={exp.company}
                  onChange={(e) =>
                    updateItem(expIndex, "company", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="form-label">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Mountain View, CA"
                value={exp.location}
                onChange={(e) =>
                  updateItem(expIndex, "location", e.target.value)
                }
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Jan 2022"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateItem(expIndex, "startDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label className="form-label">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder={exp.isCurrentRole ? "Present" : "Dec 2023"}
                  value={exp.isCurrentRole ? "Present" : exp.endDate}
                  disabled={exp.isCurrentRole}
                  onChange={(e) =>
                    updateItem(expIndex, "endDate", e.target.value)
                  }
                />
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.isCurrentRole}
                  onChange={(e) =>
                    updateItem(expIndex, "isCurrentRole", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 
                             focus:ring-brand-500/40 focus:ring-2"
                />
                <span className="text-sm text-surface-400">
                  I currently work here
                </span>
              </label>
            </div>
          </div>

          {/* Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="form-label mb-0">
                Key Achievements / Responsibilities
              </label>
              <button
                type="button"
                onClick={() => addBullet(expIndex)}
                className="btn-ghost text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Bullet
              </button>
            </div>
            <div className="space-y-2">
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start gap-2">
                  <span className="mt-3.5 w-1.5 h-1.5 rounded-full bg-surface-500 flex-shrink-0" />
                  <textarea
                    className="form-textarea flex-1"
                    rows={2}
                    placeholder="Led development of a microservices architecture that improved system throughput by 40%..."
                    value={bullet}
                    onChange={(e) =>
                      updateBullet(expIndex, bulletIndex, e.target.value)
                    }
                  />
                  {exp.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(expIndex, bulletIndex)}
                      className="mt-2 p-1.5 text-surface-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-surface-500">
              💡 Tip: Use action verbs and quantify results. AI will rewrite
              these using the XYZ formula.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
