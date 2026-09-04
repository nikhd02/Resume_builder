"use client";

import React from "react";
import type { PersonalInfo } from "@/types/resume";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  FileText,
} from "lucide-react";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({
  data,
  onChange,
}: PersonalInfoFormProps) {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/25">
          <User className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Personal Information
          </h2>
          <p className="text-sm text-surface-400">
            Your contact details and professional summary
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="form-label">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            id="fullName"
            type="text"
            className="form-input pl-10"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              id="email"
              type="email"
              className="form-input pl-10"
              placeholder="john@example.com"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              id="phone"
              type="tel"
              className="form-input pl-10"
              placeholder="+1 (555) 123-4567"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            id="location"
            type="text"
            className="form-input pl-10"
            placeholder="San Francisco, CA"
            value={data.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>
      </div>

      {/* LinkedIn & Website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="linkedin" className="form-label">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              id="linkedin"
              type="url"
              className="form-input pl-10"
              placeholder="linkedin.com/in/johndoe"
              value={data.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="website" className="form-label">
            Website / Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              id="website"
              type="url"
              className="form-input pl-10"
              placeholder="johndoe.dev"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <label htmlFor="summary" className="form-label">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Professional Summary
          </div>
        </label>
        <textarea
          id="summary"
          className="form-textarea"
          rows={4}
          placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure..."
          value={data.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-surface-500">
          {data.summary.length}/500 characters · AI will optimize this for the
          target JD
        </p>
      </div>
    </div>
  );
}
