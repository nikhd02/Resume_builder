"use client";

import React, { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import ResumePDFDocument from "@/components/pdf/ResumePDFDocument";
import type { UserData, OptimizedResumeResponse, ResumeTemplate } from "@/types/resume";

interface PDFDownloadButtonProps {
  userData: UserData;
  optimizedData: OptimizedResumeResponse | null;
  template: ResumeTemplate;
}

export default function PDFDownloadButton({ userData, optimizedData, template }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <ResumePDFDocument userData={userData} optimizedData={optimizedData} template={template} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = userData.personalInfo.fullName
        ? `${userData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "ATS_Resume.pdf";
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [userData, optimizedData, template]);

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="btn-primary flex items-center gap-2 w-full justify-center"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download ATS Resume (PDF)
        </>
      )}
    </button>
  );
}
