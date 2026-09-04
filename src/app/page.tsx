"use client";

import React from "react";
import Link from "next/link";
import { FileText, Sparkles, Target, Zap, ShieldCheck, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col font-sans selection:bg-brand-500/30">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-xl bg-surface-950/50 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-lg shadow-brand-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-tight">
              ATS <span className="text-gradient">Builder</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <Link href="/builder" className="btn-secondary hidden md:flex items-center gap-2 py-2 px-5">
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-white max-w-[900px] leading-[1.1] mb-6 tracking-tight animate-slide-up">
          Build 100% ATS-Optimized Resumes with <span className="text-gradient">AI Magic</span>
        </h1>
        
        <p className="text-lg md:text-xl text-surface-400 max-w-[650px] mb-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
          Bypass the bots and land more interviews. Our intelligent builder analyzes your job description, rewrites your experience, and generates a flawless ATS-compliant PDF instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link href="/builder" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2 glow-brand">
            Build Your Resume <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center">
            How it works
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-surface-900 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Everything you need to get hired
            </h2>
            <p className="text-surface-400 max-w-[500px] mx-auto">
              Our AI engine handles the heavy lifting so you can focus on preparing for the interview.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6 text-brand-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">XYZ Bullet Rewriter</h3>
              <p className="text-surface-400 leading-relaxed text-sm">
                Paste your simple job descriptions and watch AI transform them into powerful, quantifiable achievements using Google&apos;s recommended XYZ formula.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant ATS Matching</h3>
              <p className="text-surface-400 leading-relaxed text-sm">
                Paste your target job description and our engine will extract critical keywords, injecting them seamlessly into your profile for a 90%+ match score.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Parser Friendly</h3>
              <p className="text-surface-400 leading-relaxed text-sm">
                No complex layouts or weird fonts. Our PDF generation engine is strictly optimized for maximum readability by legacy and modern ATS systems alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-surface-950 py-12 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-bold text-white tracking-wide">ATS Builder</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <p className="text-xs text-surface-500 mb-1">
              &copy; {new Date().getFullYear()} ATS Resume Builder. All rights reserved.
            </p>
            <p className="text-xs font-medium text-surface-400">
              Designed & Developed with ❤️ by <a href="https://github.com/nikhd02" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 transition-colors">Adarsh Dubey</a>
            </p>
          </div>

          <div className="flex gap-4 text-xs text-surface-500">
            <a href="https://github.com/nikhd02/Resume_builder" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Source Code</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
