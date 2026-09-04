import type {
  UserData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillsData,
} from "@/types/resume";

export const defaultPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
};

export const createDefaultExperience = (): ExperienceItem => ({
  id: crypto.randomUUID(),
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrentRole: false,
  bullets: [""],
});

export const createDefaultEducation = (): EducationItem => ({
  id: crypto.randomUUID(),
  degree: "",
  institution: "",
  location: "",
  graduationDate: "",
  gpa: "",
  relevantCoursework: "",
});

export const defaultSkills: SkillsData = {
  technical: [],
  soft: [],
  certifications: [],
  languages: [],
};

export const defaultUserData: UserData = {
  personalInfo: defaultPersonalInfo,
  experience: [createDefaultExperience()],
  education: [createDefaultEducation()],
  skills: defaultSkills,
  jobDescription: "",
};
