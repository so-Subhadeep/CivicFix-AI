import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // adjust path as needed

// ── Status config ────────────────────────────────────────────────────────────
const STATUSES = [
  {
    key: "open",
    label: "Open",
    colors: {
      active: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#F59E0B",
  },
  {
    key: "in-progress",
    label: "In Progress",
    colors: {
      active: { bg: "#EFF6FF", text: "#1D4ED8", border: "#93C5FD" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#3B82F6",
  },
  {
    key: "resolved",
    label: "Resolved",
    colors: {
      active: { bg: "#F0FDF4", text: "#166534", border: "#86EFAC" },
      idle:   { bg: "transparent", text: "#9CA3AF", border: "#E5E7EB" },
    },
    dot: "#22C55E",
  },
];

// ── Helper: get config by key ────────────────────────────────────────────────
function getStatus(key) {
  return STATUSES.find((s) => s.key === key) || STATUSES[0];
}

// ── StatusBadge (read-only pill shown in card header) ────────────────────────
function StatusBadge({ status }) {
  const cfg = getStatus(status);
  const { bg, text, border } = cfg.colors.active;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.02em",
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

// ── StatusControls (3 buttons) ───────────────────────────────────────────────
function StatusControls({ issueId, currentStatus, onUpdate }) {
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus) {
    if (newStatus === currentStatus || loading) return;
    setLoading(true);
    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, { status: newStatus });
      onUpdate(issueId, newStatus); // optimistic local update
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        marginTop: "14px",
        paddingTop: "14px",
        borderTop: "1px solid #F3F4F6",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#9CA3AF",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          alignSelf: "center",
          marginRight: "4px",
        }}
      >
        Status:
      </span>

      {STATUSES.map((s) => {
        const isActive = s.key === currentStatus;
        const { bg, text, border } = isActive
          ? s.colors.active
          : s.colors.idle;

        return (
          <button
            key={s.key}
            onClick={() => handleChange(s.key)}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 13px",
              borderRadius: "8px",
              border: `1.5px solid ${border}`,
              backgroundColor: bg,
              color: text,
              fontSize: "12px",
              fontWeight: isActive ? 700 : 500,
              cursor: isActive || loading ? "default" : "pointer",
              transition: "all 0.15s ease",
              outline: "none",
              boxShadow: isActive
                ? `0 0 0 2px ${s.colors.active.border}40`
                : "none",
              opacity: loading && !isActive ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive && !loading) {
                e.currentTarget.style.borderColor = s.colors.active.border;
                e.currentTarget.style.color = s.colors.active.text;
                e.currentTarget.style.backgroundColor = s.colors.active.bg + "88";
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
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: isActive ? s.dot : "#D1D5DB",
                flexShrink: 0,
              }}
            />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── IssueCard ────────────────────────────────────────────────────────────────
function IssueCard({ issue, onStatusUpdate }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)")
      }
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {issue.title || "Untitled Issue"}
        </h3>
        <StatusBadge status={issue.status} />
      </div>

      {/* Description */}
      {issue.description && (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "13.5px",
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          {issue.description}
        </p>
      )}

      {/* Meta */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          fontSize: "12px",
          color: "#9CA3AF",
        }}
      >
        {issue.createdAt && (
          <span>
            🕐{" "}
            {new Date(
              issue.createdAt.seconds ? issue.createdAt.seconds * 1000 : issue.createdAt
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
        {issue.reportedBy && <span>👤 {issue.reportedBy}</span>}
      </div>

      {/* Status Controls */}
      <StatusControls
        issueId={issue.id}
        currentStatus={issue.status || "open"}
        onUpdate={onStatusUpdate}
      />
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Fetch issues from Firestore (unchanged logic)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "issues"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssues(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Optimistic local status update (avoids waiting for Firestore re-fetch)
  function handleStatusUpdate(issueId, newStatus) {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  }

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.status === filter);

  const counts = {
    all: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    "in-progress": issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
        padding: "32px 24px",
      }}
    >
      {/* Page Header */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 4px",
          }}
        >
          Issue Tracker
        </h1>
        <p style={{ margin: "0 0 28px", color: "#6B7280", fontSize: "14px" }}>
          {issues.length} issue{issues.length !== 1 ? "s" : ""} total
        </p>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "24px",
            backgroundColor: "#F3F4F6",
            padding: "4px",
            borderRadius: "10px",
            width: "fit-content",
          }}
        >
          {[
            { key: "all", label: "All" },
            { key: "open", label: "Open" },
            { key: "in-progress", label: "In Progress" },
            { key: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "6px 16px",
                borderRadius: "7px",
                border: "none",
                backgroundColor: filter === tab.key ? "#FFFFFF" : "transparent",
                color: filter === tab.key ? "#111827" : "#6B7280",
                fontSize: "13px",
                fontWeight: filter === tab.key ? 600 : 500,
                cursor: "pointer",
                boxShadow:
                  filter === tab.key
                    ? "0 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: "6px",
                  backgroundColor:
                    filter === tab.key ? "#F3F4F6" : "transparent",
                  color: "#9CA3AF",
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "999px",
                }}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Issue List */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#9CA3AF",
              fontSize: "14px",
            }}
          >
            Loading issues…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#9CA3AF",
              fontSize: "14px",
              border: "2px dashed #E5E7EB",
              borderRadius: "12px",
            }}
          >
            No issues found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}