import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUSES = [
  {
    key: "open",
    label: "Open",
    colors: {
      active: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#F59E0B",
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
  },
  {
    key: "in-progress",
    label: "In Progress",
    colors: {
      active: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#3B82F6",
    gradient: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
  },
  {
    key: "resolved",
    label: "Resolved",
    colors: {
      active: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#22C55E",
    gradient: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
  },
];

function getStatus(key) {
  return STATUSES.find((s) => s.key === key) || STATUSES[0];
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = getStatus(status);
  const { bg, text, border } = cfg.colors.active;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "4px 11px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      backgroundColor: bg,
      color: text,
      border: `1px solid ${border}`,
      whiteSpace: "nowrap",
      textTransform: "uppercase",
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: "50%",
        backgroundColor: cfg.dot,
        flexShrink: 0,
        boxShadow: `0 0 4px ${cfg.dot}`,
      }} />
      {cfg.label}
    </span>
  );
}

// ── StatusControls ────────────────────────────────────────────────────────────
function StatusControls({ issueId, currentStatus, onUpdate }) {
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus) {
    if (newStatus === currentStatus || loading) return;
    setLoading(true);
    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, { status: newStatus });
      onUpdate(issueId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexWrap: "wrap",
      marginTop: "16px",
      paddingTop: "14px",
      borderTop: "1px solid #F1F5F9",
    }}>
      <span style={{
        fontSize: "10px",
        fontWeight: 700,
        color: "#CBD5E1",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginRight: "4px",
      }}>
        Move to
      </span>
      {STATUSES.map((s) => {
        const isActive = s.key === currentStatus;
        const { bg, text, border } = isActive ? s.colors.active : s.colors.idle;
        return (
          <button
            key={s.key}
            onClick={() => handleChange(s.key)}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "8px",
              border: `1.5px solid ${border}`,
              backgroundColor: bg,
              color: text,
              fontSize: "12px",
              fontWeight: isActive ? 700 : 500,
              cursor: isActive || loading ? "default" : "pointer",
              transition: "all 0.18s ease",
              outline: "none",
              boxShadow: isActive ? `0 0 0 3px ${s.colors.active.border}70` : "none",
              opacity: loading && !isActive ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive && !loading) {
                e.currentTarget.style.borderColor = s.colors.active.border;
                e.currentTarget.style.color = s.colors.active.text;
                e.currentTarget.style.backgroundColor = s.colors.active.bg;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = s.colors.idle.border;
                e.currentTarget.style.color = s.colors.idle.text;
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span style={{
              width: 6, height: 6,
              borderRadius: "50%",
              backgroundColor: isActive ? s.dot : "#D1D5DB",
              flexShrink: 0,
            }} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── DeleteButton ──────────────────────────────────────────────────────────────
function DeleteButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "12px",
        padding: "6px 12px",
        borderRadius: "8px",
        border: `1px solid ${hovered ? "#FECACA" : "#F1F5F9"}`,
        backgroundColor: hovered ? "#FFF5F5" : "#FAFAFA",
        color: hovered ? "#DC2626" : "#94A3B8",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
      Delete
    </button>
  );
}

// ── IssueCard ─────────────────────────────────────────────────────────────────
function IssueCard({ issue, onStatusUpdate, onDelete, user }) {
  const [hovered, setHovered] = useState(false);
  const statusCfg = getStatus(issue.status);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${hovered ? "#C7D2FE" : "#EEF0F4"}`,
        borderLeft: `4px solid ${statusCfg.dot}`,
        borderRadius: "16px",
        padding: "22px 24px",
        boxShadow: hovered
          ? "0 12px 32px rgba(79,70,229,0.10), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 1px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow on hover */}
      <div style={{
        position: "absolute",
        top: 0, right: 0,
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${statusCfg.dot}10 0%, transparent 70%)`,
        transform: "translate(30%, -30%)",
        pointerEvents: "none",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
      }}>
        <h3 style={{
          margin: 0,
          fontSize: "15px",
          fontWeight: 600,
          color: "#0F172A",
          lineHeight: 1.5,
          flex: 1,
          letterSpacing: "-0.1px",
        }}>
          {issue.title || "Untitled Issue"}
        </h3>
        <StatusBadge status={issue.status} />
      </div>

      {/* Description */}
      {issue.description && (
        <p style={{
          margin: "10px 0 0",
          fontSize: "13.5px",
          color: "#64748B",
          lineHeight: 1.7,
        }}>
          {issue.description}
        </p>
      )}

      {/* Meta */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginTop: "14px",
        flexWrap: "wrap",
      }}>
        {issue.createdAt && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11.5px",
            color: "#94A3B8",
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "6px",
            padding: "3px 9px",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {new Date(
              issue.createdAt.seconds ? issue.createdAt.seconds * 1000 : issue.createdAt
            ).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
        {issue.userEmail && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11.5px",
            color: "#94A3B8",
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "6px",
            padding: "3px 9px",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {issue.userEmail}
          </span>
        )}
      </div>

      {/* Status Controls */}
      <StatusControls
        issueId={issue.id}
        currentStatus={issue.status || "open"}
        onUpdate={onStatusUpdate}
      />

      {/* Delete */}
      {issue.userId === user.uid && (
        <DeleteButton onClick={() => onDelete(issue.id)} />
      )}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, count, dot, gradient, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 130px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        padding: "18px 20px",
        borderRadius: "14px",
        border: `1.5px solid ${active ? "#C7D2FE" : hovered ? "#E0E7FF" : "#EEF0F4"}`,
        background: active
          ? "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)"
          : hovered
          ? "#FAFBFF"
          : "#FFFFFF",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: active
          ? "0 0 0 3px rgba(79,70,229,0.12), 0 4px 12px rgba(79,70,229,0.08)"
          : hovered
          ? "0 4px 16px rgba(0,0,0,0.06)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        textAlign: "left",
        transform: hovered && !active ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        {dot ? (
          <span style={{
            width: 9, height: 9,
            borderRadius: "50%",
            backgroundColor: dot,
            flexShrink: 0,
            boxShadow: `0 0 6px ${dot}80`,
          }} />
        ) : (
          <span style={{
            width: 9, height: 9,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            flexShrink: 0,
          }} />
        )}
        <span style={{
          fontSize: "12px",
          fontWeight: 600,
          color: active ? "#4338CA" : "#64748B",
          letterSpacing: "0.01em",
        }}>
          {label}
        </span>
      </div>
      <span style={{
        fontSize: "28px",
        fontWeight: 800,
        color: active ? "#3730A3" : "#0F172A",
        lineHeight: 1,
        letterSpacing: "-0.5px",
      }}>
        {count}
      </span>
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ user }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "issues"), where("userId", "==", user.uid)),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setIssues(data);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  function handleStatusUpdate(issueId, newStatus) {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "issues", id));
      setIssues((prev) => prev.filter((issue) => issue.id !== id));
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert("Failed to delete issue");
    }
  };

  const filtered = filter === "all" ? issues : issues.filter((i) => i.status === filter);

  const counts = {
    all: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    "in-progress": issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #F8F7FF 0%, #F0F4FF 50%, #F5F3FF 100%)",
      fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
      padding: "40px 24px 60px",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Page Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              borderRadius: "999px",
              padding: "4px 12px",
              marginBottom: "10px",
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
              margin: "0 0 4px",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}>
              My Issues
            </h1>
            <p style={{
              margin: 0,
              color: "#94A3B8",
              fontSize: "14px",
              fontWeight: 400,
            }}>
              {issues.length === 0
                ? "No issues reported yet"
                : `${issues.length} issue${issues.length !== 1 ? "s" : ""} tracked`}
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}>
          <StatCard
            label="All" count={counts.all}
            active={filter === "all"} onClick={() => setFilter("all")}
          />
          <StatCard
            label="Open" count={counts.open} dot="#F59E0B"
            active={filter === "open"} onClick={() => setFilter("open")}
          />
          <StatCard
            label="In Progress" count={counts["in-progress"]} dot="#3B82F6"
            active={filter === "in-progress"} onClick={() => setFilter("in-progress")}
          />
          <StatCard
            label="Resolved" count={counts.resolved} dot="#22C55E"
            active={filter === "resolved"} onClick={() => setFilter("resolved")}
          />
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, #E0E7FF, transparent)",
          marginBottom: "24px",
        }} />

        {/* Issue List */}
        {loading ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            gap: "14px",
          }}>
            <div style={{
              width: "40px", height: "40px",
              borderRadius: "50%",
              border: "3px solid #E0E7FF",
              borderTop: "3px solid #6366F1",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "#CBD5E1", fontSize: "14px", margin: 0 }}>
              Loading your issues…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "72px 24px",
            background: "linear-gradient(135deg, #FAFBFF, #F5F3FF)",
            border: "1.5px dashed #C7D2FE",
            borderRadius: "20px",
          }}>
            <div style={{
              width: "56px", height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
              border: "1px solid #C7D2FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p style={{
              margin: "0 0 6px",
              fontWeight: 700,
              fontSize: "16px",
              color: "#1E293B",
              letterSpacing: "-0.2px",
            }}>
              Nothing here yet
            </p>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#94A3B8", lineHeight: 1.6 }}>
              {filter === "all"
                ? "You haven't reported any civic issues yet."
                : `No issues with status "${filter}" found.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                user={user}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}