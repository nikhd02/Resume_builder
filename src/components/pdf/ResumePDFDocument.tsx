"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { UserData, OptimizedResumeResponse, ResumeTemplate } from "@/types/resume";

// Register standard fonts for ATS compliance
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
    { src: "Helvetica-Oblique", fontStyle: "italic" },
  ],
});

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "Times-Roman" },
    { src: "Times-Bold", fontWeight: "bold" },
    { src: "Times-Italic", fontStyle: "italic" },
  ],
});

// Template Styles Generators
const getStyles = (template: ResumeTemplate) => {
  const isCompact = template === "compact";
  const isClassic = template === "classic";
  
  const fontFamily = isClassic ? "Times-Roman" : "Helvetica";
  const baseFontSize = isCompact ? 9 : isClassic ? 11 : 10;
  const nameFontSize = isCompact ? 16 : isClassic ? 20 : 18;
  const titleFontSize = isCompact ? 10 : isClassic ? 12 : 11;
  const lineHeight = isCompact ? 1.2 : 1.4;
  const spacing = isCompact ? 4 : 8;

  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: baseFontSize,
      padding: isCompact ? 30 : 40,
      lineHeight,
      color: "#1a1a1a",
    },
    header: {
      textAlign: "center",
      borderBottomWidth: template === "modern" ? 2 : 1,
      borderBottomColor: template === "modern" ? "#10b981" : "#1a1a1a",
      paddingBottom: spacing,
      marginBottom: spacing * 1.5,
    },
    name: {
      fontSize: nameFontSize,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: isClassic ? 1 : 1.5,
      color: template === "modern" ? "#064e3b" : "#1a1a1a",
    },
    contactLine: {
      fontSize: baseFontSize - 1,
      color: "#444444",
      marginTop: 3,
    },
    sectionTitle: {
      fontSize: titleFontSize,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      borderBottomWidth: isCompact ? 0.5 : 1,
      borderBottomColor: template === "modern" ? "#6ee7b7" : "#cccccc",
      paddingBottom: 2,
      marginBottom: spacing,
      marginTop: spacing * 1.5,
      color: template === "modern" ? "#065f46" : "#1a1a1a",
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: isCompact ? 0 : 1,
    },
    jobTitle: {
      fontWeight: "bold",
      fontSize: baseFontSize,
    },
    dateText: {
      fontSize: baseFontSize - 1,
      color: "#555555",
    },
    companyLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: isCompact ? 1 : 3,
    },
    companyName: {
      fontStyle: "italic",
      color: "#333333",
    },
    bullet: {
      flexDirection: "row",
      marginBottom: isCompact ? 1 : 2,
      paddingLeft: 8,
    },
    bulletDot: {
      width: 10,
      fontSize: baseFontSize,
    },
    bulletText: {
      flex: 1,
      fontSize: baseFontSize - 0.5,
      color: "#222222",
    },
    skillsRow: {
      flexDirection: "row",
      marginBottom: isCompact ? 1 : 2,
    },
    skillLabel: {
      fontWeight: "bold",
      fontSize: baseFontSize - 0.5,
      width: isCompact ? 80 : 90,
    },
    skillValue: {
      flex: 1,
      fontSize: baseFontSize - 0.5,
      color: "#333333",
    },
    summaryText: {
      fontSize: baseFontSize - 0.5,
      color: "#333333",
      lineHeight: isCompact ? 1.3 : 1.5,
    },
    eduGpa: {
      fontSize: baseFontSize - 1,
      color: "#444444",
    },
  });
};

interface ResumePDFDocumentProps {
  userData: UserData;
  optimizedData: OptimizedResumeResponse | null;
  template: ResumeTemplate;
}

export default function ResumePDFDocument({ userData, optimizedData, template }: ResumePDFDocumentProps) {
  const { personalInfo, experience, education, skills } = userData;
  const summary = optimizedData?.summary || personalInfo.summary;
  const styles = getStyles(template);

  const getBullets = (expIndex: number): string[] => {
    if (optimizedData?.experience?.[expIndex]?.bullets) {
      return optimizedData.experience[expIndex].bullets.map((b) => b.optimized);
    }
    return experience[expIndex]?.bullets?.filter((b) => b) || [];
  };

  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
  const linkParts = [personalInfo.linkedin, personalInfo.website].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || "Your Name"}</Text>
          {contactParts.length > 0 && (
            <Text style={styles.contactLine}>{contactParts.join("  |  ")}</Text>
          )}
          {linkParts.length > 0 && (
            <Text style={styles.contactLine}>{linkParts.join("  |  ")}</Text>
          )}
        </View>

        {/* Summary */}
        {summary && (
          <View>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.some((e) => e.jobTitle || e.company) && (
          <View>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp, i) => {
              if (!exp.jobTitle && !exp.company) return null;
              const bullets = getBullets(i);
              return (
                <View key={exp.id} style={i > 0 ? { marginTop: template === "compact" ? 4 : 8 } : {}}>
                  <View style={styles.expHeader}>
                    <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}
                    </Text>
                  </View>
                  <View style={styles.companyLine}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    <Text style={styles.dateText}>{exp.location}</Text>
                  </View>
                  {bullets.map((bullet, bi) => (
                    <View key={bi} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Education */}
        {education.some((e) => e.degree || e.institution) && (
          <View>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu) => {
              if (!edu.degree && !edu.institution) return null;
              return (
                <View key={edu.id} style={{ marginBottom: template === "compact" ? 2 : 4 }}>
                  <View style={styles.expHeader}>
                    <Text style={styles.jobTitle}>{edu.degree}</Text>
                    <Text style={styles.dateText}>{edu.graduationDate}</Text>
                  </View>
                  <View style={styles.companyLine}>
                    <Text style={styles.companyName}>{edu.institution}</Text>
                    <Text style={styles.dateText}>{edu.location}</Text>
                  </View>
                  {edu.gpa && <Text style={styles.eduGpa}>GPA: {edu.gpa}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills */}
        {(skills.technical.length > 0 || skills.soft.length > 0 || skills.certifications.length > 0) && (
          <View>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            {skills.technical.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Technical:</Text>
                <Text style={styles.skillValue}>{skills.technical.join(", ")}</Text>
              </View>
            )}
            {skills.soft.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Soft Skills:</Text>
                <Text style={styles.skillValue}>{skills.soft.join(", ")}</Text>
              </View>
            )}
            {skills.certifications.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Certifications:</Text>
                <Text style={styles.skillValue}>{skills.certifications.join(", ")}</Text>
              </View>
            )}
            {skills.languages.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Languages:</Text>
                <Text style={styles.skillValue}>{skills.languages.join(", ")}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
