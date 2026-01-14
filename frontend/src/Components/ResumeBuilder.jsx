import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "../Stylesheets/ResumeBuilder.css";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    navigate("/login");
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    summary: "",
    experience: [{ company: "", position: "", duration: "", description: "" }],
    education: [{ school: "", degree: "", field: "", year: "" }],
    skills: [],
    certifications: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  // ATS Score Calculation
  const calculateATSScore = useMemo(() => {
    let score = 0;
    let maxScore = 100;
    let details = [];

    // Contact Information (10 points)
    if (formData.fullName?.trim()) {
      score += 5;
      details.push("✓ Full Name");
    }
    if (formData.email?.trim()) {
      score += 3;
      details.push("✓ Email");
    }
    if (formData.phone?.trim()) {
      score += 2;
      details.push("✓ Phone");
    }

 
    if (formData.summary?.trim().length > 50) {
      score += 10;
      details.push("✓ Professional Summary");
    } else if (formData.summary?.trim().length > 0) {
      score += 5;
      details.push("⚠ Professional Summary (expand for better ATS)");
    }

    const filledExperience = formData.experience.filter(
      (exp) => exp.company || exp.position
    );
    if (filledExperience.length > 0) {
      score += 10;
      details.push(`✓ Work Experience (${filledExperience.length} entries)`);
    }
    if (filledExperience.some((exp) => exp.description?.length > 50)) {
      score += 10;
      details.push("✓ Experience Description");
    }

    // Education (15 points)
    const filledEducation = formData.education.filter(
      (edu) => edu.school || edu.degree
    );
    if (filledEducation.length > 0) {
      score += 10;
      details.push(`✓ Education (${filledEducation.length} entries)`);
    }
    if (filledEducation.some((edu) => edu.field?.trim())) {
      score += 5;
      details.push("✓ Field of Study");
    }

    // Skills (20 points)
    if (formData.skills.length > 0) {
      const skillPoints = Math.min(formData.skills.length * 2, 15);
      score += skillPoints;
      details.push(`✓ Skills (${formData.skills.length} skills)`);
    } else {
      details.push("⚠ Add skills for better ATS matching");
    }

    // Certifications (10 points)
    if (formData.certifications.length > 0) {
      const certPoints = Math.min(formData.certifications.length * 2, 10);
      score += certPoints;
      details.push(`✓ Certifications (${formData.certifications.length})`);
    }

    // Location (5 points)
    if (formData.location?.trim()) {
      score += 5;
      details.push("✓ Location");
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      details,
      percentage: Math.min(Math.round((score / maxScore) * 100), 100),
    };
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      experience: newExperience,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: newEducation,
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", duration: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", year: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (certInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput("");
    }
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const downloadResumeAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add text with word wrap
    const addWrappedText = (text, x, y, fontSize, fontType = "normal", maxWidth) => {
      doc.setFontSize(fontSize);
      if (fontType === "bold") {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * (fontSize / 2.5);
    };

    // Check if we need a new page
    const checkNewPage = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - 10) {
        doc.addPage();
        yPosition = 15;
      }
    };

    // Header
    yPosition = addWrappedText(
      formData.fullName || "Your Name",
      margin,
      yPosition,
      20,
      "bold",
      contentWidth
    );
    yPosition += 5;

    const contactInfo = [
      formData.email,
      formData.phone,
      formData.location,
    ]
      .filter((x) => x)
      .join(" | ");
    yPosition = addWrappedText(contactInfo, margin, yPosition, 10, "normal", contentWidth);
    yPosition += 10;

    // Professional Summary
    if (formData.summary?.trim()) {
      checkNewPage(20);
      yPosition = addWrappedText(
        "PROFESSIONAL SUMMARY",
        margin,
        yPosition,
        12,
        "bold",
        contentWidth
      );
      yPosition += 3;
      yPosition = addWrappedText(
        formData.summary,
        margin,
        yPosition,
        10,
        "normal",
        contentWidth
      );
      yPosition += 8;
    }

    // Experience
    if (formData.experience.some((exp) => exp.company || exp.position)) {
      checkNewPage(15);
      yPosition = addWrappedText(
        "WORK EXPERIENCE",
        margin,
        yPosition,
        12,
        "bold",
        contentWidth
      );
      yPosition += 3;

      formData.experience.forEach((exp) => {
        if (exp.company || exp.position) {
          checkNewPage(15);
          yPosition = addWrappedText(
            `${exp.position}${exp.company ? ` at ${exp.company}` : ""}`,
            margin,
            yPosition,
            10,
            "bold",
            contentWidth
          );
          yPosition += 2;
          if (exp.duration) {
            yPosition = addWrappedText(
              exp.duration,
              margin,
              yPosition,
              9,
              "normal",
              contentWidth
            );
          }
          if (exp.description) {
            yPosition = addWrappedText(
              exp.description,
              margin,
              yPosition,
              9,
              "normal",
              contentWidth
            );
          }
          yPosition += 4;
        }
      });
      yPosition += 4;
    }

    // Education
    if (formData.education.some((edu) => edu.school || edu.degree)) {
      checkNewPage(15);
      yPosition = addWrappedText(
        "EDUCATION",
        margin,
        yPosition,
        12,
        "bold",
        contentWidth
      );
      yPosition += 3;

      formData.education.forEach((edu) => {
        if (edu.school || edu.degree) {
          checkNewPage(10);
          yPosition = addWrappedText(
            `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
            margin,
            yPosition,
            10,
            "bold",
            contentWidth
          );
          yPosition += 2;
          yPosition = addWrappedText(
            `${edu.school}${edu.year ? ` - ${edu.year}` : ""}`,
            margin,
            yPosition,
            9,
            "normal",
            contentWidth
          );
          yPosition += 4;
        }
      });
      yPosition += 4;
    }

    // Skills
    if (formData.skills.length > 0) {
      checkNewPage(10);
      yPosition = addWrappedText(
        "SKILLS",
        margin,
        yPosition,
        12,
        "bold",
        contentWidth
      );
      yPosition += 3;
      yPosition = addWrappedText(
        formData.skills.join(" • "),
        margin,
        yPosition,
        9,
        "normal",
        contentWidth
      );
      yPosition += 8;
    }

    // Certifications
    if (formData.certifications.length > 0) {
      checkNewPage(10);
      yPosition = addWrappedText(
        "CERTIFICATIONS",
        margin,
        yPosition,
        12,
        "bold",
        contentWidth
      );
      yPosition += 3;
      formData.certifications.forEach((cert) => {
        yPosition = addWrappedText(`• ${cert}`, margin, yPosition, 9, "normal", contentWidth);
      });
    }

    doc.save(`${formData.fullName || "Resume"}.pdf`);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "#28a745";
    if (percentage >= 60) return "#ffc107";
    if (percentage >= 40) return "#fd7e14";
    return "#dc3545";
  };

  return (
    <div className="resume-builder">
      <div className="resume-container">
        <div className="resume-header">
          <h1>📄 Resume Builder</h1>
          <p>Create a professional resume with ATS optimization</p>
        </div>

        <div className="resume-content">
          {/* Preview Section */}
          <div className="resume-preview">
            {/* ATS Score Card */}
            <div className="ats-score-card">
              <h3>ATS Score</h3>
              <div className="score-display">
                <div className="score-circle" style={{ borderColor: getScoreColor(calculateATSScore.percentage) }}>
                  <div className="score-value" style={{ color: getScoreColor(calculateATSScore.percentage) }}>
                    {calculateATSScore.percentage}%
                  </div>
                </div>
                <div className="score-label">
                  {calculateATSScore.percentage >= 80
                    ? "Excellent"
                    : calculateATSScore.percentage >= 60
                    ? "Good"
                    : calculateATSScore.percentage >= 40
                    ? "Fair"
                    : "Needs Work"}
                </div>
              </div>
              <div className="score-details">
                {calculateATSScore.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </div>

            <div className="preview-header">
              <h2>{formData.fullName || "Your Name"}</h2>
              <p>
                {formData.email} {formData.phone && `| ${formData.phone}`}{" "}
                {formData.location && `| ${formData.location}`}
              </p>
            </div>

            {formData.summary && (
              <section className="preview-section">
                <h3>Professional Summary</h3>
                <p>{formData.summary}</p>
              </section>
            )}

            {formData.experience.length > 0 && (
              <section className="preview-section">
                <h3>Experience</h3>
                {formData.experience.map(
                  (exp, idx) =>
                    (exp.company || exp.position) && (
                      <div key={idx} className="preview-item">
                        <h4>
                          {exp.position} {exp.company && `@ ${exp.company}`}
                        </h4>
                        {exp.duration && <p className="duration">{exp.duration}</p>}
                        {exp.description && <p>{exp.description}</p>}
                      </div>
                    )
                )}
              </section>
            )}

            {formData.education.length > 0 && (
              <section className="preview-section">
                <h3>Education</h3>
                {formData.education.map(
                  (edu, idx) =>
                    (edu.school || edu.degree) && (
                      <div key={idx} className="preview-item">
                        <h4>
                          {edu.degree} in {edu.field}
                        </h4>
                        <p>
                          {edu.school} - {edu.year}
                        </p>
                      </div>
                    )
                )}
              </section>
            )}

            {formData.skills.length > 0 && (
              <section className="preview-section">
                <h3>Skills</h3>
                <div className="skills-tags">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {formData.certifications.length > 0 && (
              <section className="preview-section">
                <h3>Certifications</h3>
                <ul>
                  {formData.certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Form Section */}
          <div className="resume-form">
            <form>
              {/* Personal Info */}
              <section className="form-section">
                <h3>Personal Information</h3>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </section>

              {/* Professional Summary */}
              <section className="form-section">
                <h3>Professional Summary</h3>
                <textarea
                  name="summary"
                  placeholder="Write a brief professional summary..."
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                />
              </section>

              {/* Experience */}
              <section className="form-section">
                <h3>Work Experience</h3>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="form-group">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) =>
                        handleExperienceChange(index, "position", e.target.value)
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                      value={exp.duration}
                      onChange={(e) =>
                        handleExperienceChange(index, "duration", e.target.value)
                      }
                      className="form-input"
                    />
                    <textarea
                      placeholder="Job description..."
                      value={exp.description}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="form-textarea"
                      rows="2"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-add"
                >
                  + Add Experience
                </button>
              </section>

              {/* Education */}
              <section className="form-section">
                <h3>Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="form-group">
                    <input
                      type="text"
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) =>
                        handleEducationChange(index, "school", e.target.value)
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) =>
                        handleEducationChange(index, "field", e.target.value)
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(index, "year", e.target.value)
                      }
                      className="form-input"
                    />
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addEducation} className="btn-add">
                  + Add Education
                </button>
              </section>

              {/* Skills */}
              <section className="form-section">
                <h3>Skills</h3>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter a skill (e.g., React, Python)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-add-inline"
                  >
                    Add
                  </button>
                </div>
                <div className="skills-tags">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section className="form-section">
                <h3>Certifications</h3>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Add a certification"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="btn-add-inline"
                  >
                    Add
                  </button>
                </div>
                <div className="certifications-list">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="cert-item">
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="btn-remove-inline"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Download Button */}
              <button
                type="button"
                onClick={downloadResumeAsPDF}
                className="btn-download"
              >
                📥 Download as PDF
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
