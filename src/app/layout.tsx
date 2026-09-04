import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free ATS Resume Builder & Checker | 100% ATS-Optimized PDFs",
  description: "Build a 100% ATS-optimized resume for free or upload your existing resume to check its ATS score. Get hired faster with AI-powered keyword matching and XYZ formula bullets.",
  keywords: ["free resume builder", "ats resume checker", "free ats resume", "resume score checker", "resume optimizer", "ats compliant resume", "ai resume builder", "free pdf resume maker"],
  authors: [{ name: "Adarsh Dubey", url: "https://adarsh-portfolio-delta-sepia.vercel.app/" }],
  openGraph: {
    title: "Free ATS Resume Builder & Score Checker",
    description: "Create a 100% ATS-compliant resume for free or upload yours to check its ATS score instantly.",
    type: "website",
    siteName: "ATS Resume Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Builder & Checker",
    description: "Build and check your ATS resume score for free.",
  }
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
