import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { userData, jobDescription, autoFix } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add your GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide a detailed job description (at least 50 characters)" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const experienceContext = userData.experience
      ?.map(
        (exp: { jobTitle: string; company: string; location?: string; startDate?: string; endDate?: string; bullets: string[] }, i: number) =>
          `Position ${i + 1}: ${exp.jobTitle} at ${exp.company} (${exp.startDate || ""} - ${exp.endDate || ""}, ${exp.location || ""})\nBullets:\n${exp.bullets.map((b: string) => `- ${b}`).join("\n")}`
      )
      .join("\n\n") || "";

    const skillsContext = `Technical: ${(userData.skills?.technical || []).join(", ")}\nSoft: ${(userData.skills?.soft || []).join(", ")}\nCertifications: ${(userData.skills?.certifications || []).join(", ")}\nLanguages: ${(userData.skills?.languages || []).join(", ")}`;

    const autoFixInstruction = autoFix 
      ? "\n\nCRITICAL OVERRIDE: The user has clicked 'Auto-Fix'. You MUST aggressively and seamlessly integrate ALL missing top keywords from the Job Description directly into the experience bullets and professional summary to GUARANTEE an ATS Score of 90 or above."
      : "";

    const prompt = `You are an expert ATS (Applicant Tracking System) resume optimizer powered by Google Gemini. Your task is to analyze a job description and optimize a candidate's resume content to maximize ATS compatibility and keyword matching.${autoFixInstruction}

## INPUT DATA

### Job Description:
${jobDescription}

### Candidate's Current Experience:
${experienceContext}

### Candidate's Current Skills:
${skillsContext}

### Candidate's Current Summary:
${userData.personalInfo?.summary || "None provided"}

## YOUR TASK

1. **Extract Keywords**: Identify the top 15-20 most important keywords, skills, tools, and qualifications from the job description.

2. **Auto-Generate / Rewrite Experience Bullets**: Based on the candidate's job titles and any raw or short bullet points provided, auto-generate detailed experience bullet points using the strict XYZ formula:
   "Accomplished [X] as measured by [Y] by doing [Z]"
   Where X = what was accomplished, Y = measurable impact/metric, Z = how it was done / actions & technologies used.
   - You MUST auto-generate rich, professional bullets even if the user only provided a job title or very short simple descriptions.
   - Naturally inject relevant JD keywords into these generated bullets.
   - Keep bullets concise and impactful (1-2 lines max).
   - Use strong action verbs and estimate quantifiable metrics realistically if needed.
   - **CRITICAL**: You MUST generate at least 5 measurable results (bullets with quantifiable metrics/numbers) across the entire experience section.
   - Ensure every bullet strictly follows the XYZ formula.

3. **Auto-Generate ATS Summary**: Write a 3-4 sentence professional summary that:
   - **CRITICAL**: You MUST explicitly mention the EXACT job title from the job description in the first sentence.
   - Opens with years of experience and core expertise matching the target job.
   - Incorporates top JD keywords naturally.
   - Highlights most relevant accomplishments based on the experience provided.
   - Matches the tone and requirements of the target position.
   - **MUST generate this even if the original summary was blank.**

4. **Calculate ATS Score**: Rate from 0 to 100 how well the optimized resume matches the target job description based on keyword coverage, experience relevance, and skills alignment.

5. **Suggest Skills**: List 5-8 relevant skills from the target job description that the candidate should consider highlighting or adding.

6. **Improvement Tips**: Generate 2-3 specific, actionable tips (1 sentence each) on how the user can further improve their resume to increase the ATS score (e.g., adding specific certifications, elaborating on a particular skill).

## JSON OUTPUT FORMAT SCHEMA
You MUST return ONLY a JSON object matching this exact structure:
{
  "summary": "optimized professional summary string",
  "experience": [
    {
      "jobTitle": "job title string",
      "company": "company string",
      "location": "location string",
      "startDate": "start date string",
      "endDate": "end date string",
      "bullets": [
        {
          "original": "original bullet text",
          "optimized": "Accomplished X as measured by Y by doing Z bullet text with keywords",
          "matchedKeywords": ["keyword1", "keyword2"]
        }
      ]
    }
  ],
  "extractedKeywords": ["keyword1", "keyword2"],
  "skillsToHighlight": ["skill1", "skill2"],
  "improvementTips": ["Tip 1", "Tip 2"],
  "atsScore": 85
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const optimizedData = JSON.parse(cleanJson);

    return NextResponse.json(optimizedData);
  } catch (error: unknown) {
    console.error("Gemini Resume generation error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Gemini AI returned invalid JSON format. Please try again." },
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to optimize resume with Gemini: ${message}` },
      { status: 500 }
    );
  }
}
