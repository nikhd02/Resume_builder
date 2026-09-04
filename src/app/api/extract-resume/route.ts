import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required.' },
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
      You are an expert Resume Data Extractor.
      Analyze the following raw resume text and extract all information into a structured JSON format.
      Make sure to extract ALL experience items and education items.
      Generate unique IDs (uuid or simple random strings) for the "id" fields in experience and education.

      Return ONLY a JSON object with this exact structure (no markdown, just JSON):
      {
        "personalInfo": {
          "fullName": "extracted full name",
          "email": "extracted email",
          "phone": "extracted phone",
          "location": "extracted location/city",
          "linkedin": "extracted linkedin url or username",
          "website": "extracted github/portfolio link",
          "summary": "professional summary or objective"
        },
        "experience": [
          {
            "id": "random-id-1",
            "jobTitle": "Job Title",
            "company": "Company Name",
            "location": "Job Location",
            "startDate": "Start Date (e.g. Jan 2020)",
            "endDate": "End Date (e.g. Present or Dec 2022)",
            "isCurrentRole": boolean (true if endDate is Present/Current),
            "bullets": ["bullet point 1", "bullet point 2"]
          }
        ],
        "education": [
          {
            "id": "random-id-2",
            "degree": "Degree Name",
            "institution": "University/College",
            "location": "Location",
            "graduationDate": "Graduation Year/Month",
            "gpa": "GPA if mentioned",
            "relevantCoursework": "Coursework if mentioned"
          }
        ],
        "skills": {
          "technical": ["skill1", "skill2"],
          "soft": ["skill1", "skill2"],
          "certifications": ["cert1", "cert2"],
          "languages": ["lang1", "lang2"]
        }
      }

      Raw Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error extracting resume data:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while extracting resume data.' },
      { status: 500 }
    );
  }
}
