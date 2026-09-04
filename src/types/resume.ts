// ============================================================
// TypeScript Interfaces for ATS Resume Builder
// ============================================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
  relevantCoursework: string;
}

export interface SkillsData {
  technical: string[];
  soft: string[];
  certifications: string[];
  languages: string[];
}

export interface UserData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  jobDescription: string;
}

// AI Optimization Response
export interface OptimizedBullet {
  original: string;
  optimized: string;
  matchedKeywords: string[];
}

export interface OptimizedExperience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: OptimizedBullet[];
}

export interface OptimizedResumeResponse {
  summary: string;
  experience: OptimizedExperience[];
  extractedKeywords: string[];
  skillsToHighlight: string[];
  improvementTips: string[];
  atsScore: number;
}

// Form state
export type FormTab =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "job-description";

export type ResumeTemplate = "modern" | "classic" | "compact";
