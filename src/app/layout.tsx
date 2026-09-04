import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Builder — AI-Powered Resume Optimization",
  description:
    "Build a 100% ATS-optimized resume. AI matches your experience to job descriptions using the XYZ formula and generates clean, compliant PDFs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
