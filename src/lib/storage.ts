import type { UserData } from "@/types/resume";
import { defaultUserData } from "@/lib/defaults";

const STORAGE_KEY = "ats-resume-builder-data";

export function saveToLocalStorage(data: UserData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function loadFromLocalStorage(): UserData {
  if (typeof window === "undefined") return defaultUserData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserData;
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }
  return defaultUserData;
}

export function clearLocalStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
