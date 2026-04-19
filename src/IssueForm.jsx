import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ color = "#fff" }) {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: "14px", height: "14px",
        border: `2px solid ${color}40`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }} />
    </>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#374151",
          letterSpacing: "0.01em",
        }}>
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Shared input style ────────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#0F172A",
  backgroundColor: "#F8FAFC",
  border: "1.5px solid #E2E8F0",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
  fontFamily: "inherit",
};

function StyledInput({ value, onChange, placeholder, required, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        borderColor: focused ? "#6366F1" : "#E2E8F0",
        backgroundColor: focused ? "#FAFBFF" : "#F8FAFC",
        boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
      }}
    />
  );
}

function StyledTextarea({ value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={5}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        resize: "vertical",
        lineHeight: 1.7,
        minHeight: "120px",
        borderColor: focused ? "#6366F1" : "#E2E8F0",
        backgroundColor: focused ? "#FAFBFF" : "#F8FAFC",
        boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function IssueForm({ user }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Logic unchanged ───────────────────────────────────────────────────────
  const handleGenerateDescription = async () => {
    if (!title) {
      alert("Please enter a title first");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const templates = [
        `The issue regarding "${title}" has been observed at ${location || "the specified location"}. This problem has been affecting the surrounding area and may lead to inconvenience and safety concerns for residents and commuters. Immediate attention from the concerned authorities is requested.`,
        `A civic issue has been reported: "${title}". It is located at ${location || "the mentioned area"} and has persisted for some time. This situation may cause discomfort and potential hazards, and it is recommended that appropriate action be taken as soon as possible.`,
        `This is to report a problem identified as "${title}" near ${location || "the given location"}. The issue is impacting daily activities and could worsen if not addressed promptly. Kindly look into the matter and resolve it at the earliest.`,
      ];
      setDescription(templates[Math.floor(Math.random() * templates.length)]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("You must be logged in"); return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "issues"), {
        title, location, description,
        images: [],
        status: "open",
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
      });
      alert("✅ Issue reported successfully!");
      setTitle(""); setLocation(""); setDescription("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("❌ Failed to submit issue");
    }
    setIsSubmitting(false);
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #F8F7FF 0%, #F0F4FF 50%, #F5F3FF 100%)",
        fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
        padding: "40px 24px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>

        {/* Page Header */}
        <div style={{
          width: "100%",
          maxWidth: "620px",
          marginBottom: "28px",
          animation: "fadeSlideIn 0.4s ease",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: "999px",
            padding: "4px 12px",
            marginBottom: "12px",
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: "50%",
              backgroundColor: "#6366F1",
              boxShadow: "0 0 6px #6366F180",
            }} />
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#4F46E5",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              CivicFix AI
            </span>
          </div>

          <h1 style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#0F172A",
            margin: "0 0 6px",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}>
            Report a Civic Issue
          </h1>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#94A3B8",
            lineHeight: 1.6,
          }}>
            Help your community by flagging problems in your area.
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          maxWidth: "620px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #EEF0F4",
          boxShadow: "0 4px 24px rgba(79,70,229,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
          animation: "fadeSlideIn 0.45s ease",
        }}>

          {/* Card top bar */}
          <div style={{
            padding: "18px 28px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #FAFBFF, #F5F3FF)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "34px", height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                  Issue Details
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8" }}>
                  Fill in the details below
                </p>
              </div>
            </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#4F46E5",
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              borderRadius: "999px",
              padding: "4px 12px",
              letterSpacing: "0.03em",
            }}>
              New Report
            </span>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}>

            {/* Title */}
            <Field label="Issue Title" hint="Required">
              <StyledInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken streetlight on MG Road"
                required
              />
            </Field>

            {/* Location */}
            <Field label="Location" hint="Required">
              <div style={{ position: "relative" }}>
                <StyledInput
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near City Park, Sector 12"
                  required
                />
                <div style={{
                  position: "absolute",
                  right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>
            </Field>

            {/* Upload placeholder */}
            <Field label="Upload Images" hint="Optional">
              <div style={{
                border: "1.5px dashed #C7D2FE",
                borderRadius: "10px",
                backgroundColor: "#FAFBFF",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "default",
              }}>
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#EEF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#64748B" }}>
                  Image upload coming soon
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8" }}>
                  PNG, JPG up to 10MB
                </p>
              </div>
            </Field>

            {/* Description */}
            <Field label="Description" hint="AI-assisted">
              <StyledTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail, or use AI to generate one…"
                required
              />

              {/* AI Generate Button */}
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                style={{
                  marginTop: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "1.5px solid #C7D2FE",
                  background: isGenerating
                    ? "#EEF2FF"
                    : "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
                  color: "#4F46E5",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  transition: "all 0.18s ease",
                  opacity: isGenerating ? 0.75 : 1,
                  alignSelf: "flex-start",
                  boxShadow: "0 1px 4px rgba(99,102,241,0.12)",
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.25)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#A5B4FC";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(99,102,241,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#C7D2FE";
                }}
              >
                {isGenerating ? (
                  <>
                    <Spinner color="#6366F1" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </Field>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, #E0E7FF, transparent)",
            }} />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "12px",
                border: "none",
                background: isSubmitting
                  ? "#A5B4FC"
                  : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.18s ease",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 14px rgba(99,102,241,0.35)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner color="#fff" />
                  Submitting…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit Report
                </>
              )}
            </button>

            {/* Footer note */}
            <p style={{
              margin: 0,
              textAlign: "center",
              fontSize: "12px",
              color: "#CBD5E1",
            }}>
              Your report will be reviewed by local authorities
            </p>

          </form>
        </div>
      </div>
    </>
  );
}

export default IssueForm;