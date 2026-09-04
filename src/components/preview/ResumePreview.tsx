"use client";

import React from "react";
import type { UserData, OptimizedResumeResponse, ResumeTemplate } from "@/types/resume";

interface ResumePreviewProps {
  userData: UserData;
  optimizedData: OptimizedResumeResponse | null;
  template: ResumeTemplate;
}

export default function ResumePreview({ userData, optimizedData, template }: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = userData;
  const summary = optimizedData?.summary || personalInfo.summary;

  const getBullets = (expIndex: number) => {
    if (optimizedData?.experience?.[expIndex]?.bullets) {
      return optimizedData.experience[expIndex].bullets.map((b) => b.optimized);
    }
    return experience[expIndex]?.bullets || [];
  };

  const allSkills = [
    ...skills.technical,
    ...skills.soft,
    ...(optimizedData?.skillsToHighlight || []),
  ].filter((s, i, arr) => arr.indexOf(s) === i);

  const hasContent = personalInfo.fullName || experience.some((e) => e.jobTitle) || education.some((e) => e.degree);

  if (!hasContent) {
    return (
      <div className="resume-paper flex items-center justify-center p-8">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-medium text-gray-500">Your Resume Preview</p>
          <p className="text-sm text-gray-400 mt-1">Start filling in your details to see a live preview</p>
        </div>
      </div>
    );
  }

  // Dynamic Styles Mapping
  const isCompact = template === "compact";
  const isClassic = template === "classic";
  const isModern = template === "modern";

  const fontClass = isClassic ? "font-serif" : "font-sans";
  const textClass = isCompact ? "text-[9px]" : isClassic ? "text-[11px]" : "text-[10px]";
  const leadingClass = isCompact ? "leading-[1.2]" : "leading-[1.4]";
  const nameSize = isCompact ? "text-lg" : isClassic ? "text-xl" : "text-lg";
  const headerBorder = isModern ? "border-brand-600 border-b-2" : "border-gray-800 border-b-[1.5px]";
  const nameColor = isModern ? "text-brand-900" : "text-gray-900";
  const sectionTitleBorder = isModern ? "border-brand-300" : "border-gray-300";
  const sectionTitleColor = isModern ? "text-brand-800" : "text-gray-900";
  const spacingY = isCompact ? "mb-1.5" : "mb-3";
  const sectionPadding = isCompact ? "pb-0.5" : "pb-1";

  return (
    <div className={`resume-paper p-6 ${fontClass} ${textClass} ${leadingClass}`}>
      {/* Header - Name & Contact */}
      <div className={`text-center ${headerBorder} pb-2 ${spacingY}`}>
        <h1 className={`${nameSize} font-bold ${nameColor} tracking-wide uppercase`}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-1 text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|  {personalInfo.phone}</span>}
          {personalInfo.location && <span>|  {personalInfo.location}</span>}
        </div>
        <div className="flex items-center justify-center flex-wrap gap-x-3 mt-0.5 text-gray-600">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>|  {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className={spacingY}>
          <h2 className={`font-bold ${sectionTitleColor} uppercase tracking-wider border-b ${sectionTitleBorder} ${sectionPadding} mb-1`}>
            Professional Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some((e) => e.jobTitle || e.company) && (
        <div className={spacingY}>
          <h2 className={`font-bold ${sectionTitleColor} uppercase tracking-wider border-b ${sectionTitleBorder} ${sectionPadding} mb-1`}>
            Professional Experience
          </h2>
          {experience.map((exp, i) => {
            if (!exp.jobTitle && !exp.company) return null;
            const bullets = getBullets(i);
            return (
              <div key={exp.id} className={i > 0 ? (isCompact ? "mt-1.5" : "mt-2") : ""}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{exp.jobTitle}</span>
                  <span className={`text-gray-500 ${isCompact ? "text-[8px]" : "text-[9px]"}`}>
                    {exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-gray-700">{exp.company}</span>
                  <span className={`text-gray-500 ${isCompact ? "text-[8px]" : "text-[9px]"}`}>{exp.location}</span>
                </div>
                {bullets.length > 0 && bullets.some((b) => b) && (
                  <ul className="mt-0.5 ml-3 list-disc list-outside text-gray-700">
                    {bullets.filter((b) => b).map((bullet, bi) => (
                      <li key={bi} className={isCompact ? "mb-0" : "mb-0.5"}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Education */}
      {education.some((e) => e.degree || e.institution) && (
        <div className={spacingY}>
          <h2 className={`font-bold ${sectionTitleColor} uppercase tracking-wider border-b ${sectionTitleBorder} ${sectionPadding} mb-1`}>
            Education
          </h2>
          {education.map((edu) => {
            if (!edu.degree && !edu.institution) return null;
            return (
              <div key={edu.id} className="mb-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{edu.degree}</span>
                  <span className={`text-gray-500 ${isCompact ? "text-[8px]" : "text-[9px]"}`}>{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-gray-700">{edu.institution}</span>
                  <span className={`text-gray-500 ${isCompact ? "text-[8px]" : "text-[9px]"}`}>{edu.location}</span>
                </div>
                {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
                {edu.relevantCoursework && (
                  <div className="text-gray-600">
                    <span className="font-medium">Coursework:</span> {edu.relevantCoursework}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <div className={spacingY}>
          <h2 className={`font-bold ${sectionTitleColor} uppercase tracking-wider border-b ${sectionTitleBorder} ${sectionPadding} mb-1`}>
            Skills
          </h2>
          {skills.technical.length > 0 && (
            <div className={isCompact ? "mb-0" : "mb-0.5"}>
              <span className="font-bold text-gray-900">Technical: </span>
              <span className="text-gray-700">{skills.technical.join(", ")}</span>
            </div>
          )}
          {skills.soft.length > 0 && (
            <div className={isCompact ? "mb-0" : "mb-0.5"}>
              <span className="font-bold text-gray-900">Soft Skills: </span>
              <span className="text-gray-700">{skills.soft.join(", ")}</span>
            </div>
          )}
          {skills.certifications.length > 0 && (
            <div className={isCompact ? "mb-0" : "mb-0.5"}>
              <span className="font-bold text-gray-900">Certifications: </span>
              <span className="text-gray-700">{skills.certifications.join(", ")}</span>
            </div>
          )}
          {skills.languages.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Languages: </span>
              <span className="text-gray-700">{skills.languages.join(", ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
