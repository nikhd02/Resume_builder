import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and Job Description are required.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser and recruiter.
      Analyze the following Resume Text against the provided Job Description.

      Return ONLY a JSON object with this exact structure:
      {
        "score": number (0 to 100),
        "status": "Excellent" | "Good" | "Fair" | "Poor",
        "strengths": ["array of 2-3 strong points matching the JD"],
        "weaknesses": ["array of 2-3 missing skills or weak points"],
        "improvementTips": ["array of actionable tips to improve the resume"]
      }

      Job Description:
      ${jobDescription}

      Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating ATS score:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the ATS score.' },
      { status: 500 }
    );
  }
}
