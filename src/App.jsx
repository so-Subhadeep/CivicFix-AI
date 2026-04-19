import { useEffect, useState } from "react";
import IssueForm from "./IssueForm";
import Dashboard from "./Dashboard";
import "./App.css";
import AuthForm from "./AuthForm";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconReport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#F8F7FF",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  navbar: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #E5E7EB",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 12px rgba(79,70,229,0.07)",
  },
  navbarInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "62px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    backgroundColor: "#4F46E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
  },
  brandText: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111",
    letterSpacing: "-0.3px",
  },
  brandAi: {
    color: "#4F46E5",
  },
  navTabs: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  tabBtn: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "8px",
    border: active ? "1px solid #C7D2FE" : "1px solid transparent",
    backgroundColor: active ? "#EEF2FF" : "transparent",
    color: active ? "#4F46E5" : "#6B7280",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
    transition: "all 0.15s ease",
  }),
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    color: "#9CA3AF",
    fontSize: "14px",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.15s ease",
    marginLeft: "8px",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px 4px 4px",
    borderRadius: "999px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    marginRight: "8px",
  },
  avatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#4F46E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
  },
  userEmail: {
    fontSize: "13px",
    color: "#374151",
    maxWidth: "160px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState("report");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setErrorMessage("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setErrorMessage("");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (!user) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        errorMessage={errorMessage}
      />
    );
  }

  // Get initials from email for avatar
  const initials = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <div style={styles.app}>
      <header style={styles.navbar}>
        <div style={styles.navbarInner}>

          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white" />
              </svg>
            </div>
            <span style={styles.brandText}>
              CivicFix <span style={styles.brandAi}>AI</span>
            </span>
          </div>

          {/* Nav */}
          <div style={styles.navTabs}>

            {/* User pill */}
            <div style={styles.userPill}>
              <div style={styles.avatar}>{initials}</div>
              <span style={styles.userEmail}>{user.email}</span>
            </div>

            <button
              style={styles.tabBtn(page === "report")}
              onClick={() => setPage("report")}
            >
              <IconReport />
              Report Issue
            </button>

            <button
              style={styles.tabBtn(page === "dashboard")}
              onClick={() => setPage("dashboard")}
            >
              <IconDashboard />
              Dashboard
            </button>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              <IconLogout />
              Logout
            </button>

          </div>
        </div>
      </header>

      <main style={styles.main}>
        {page === "report" ? <IssueForm user={user} /> : <Dashboard user={user} />}
      </main>
    </div>
  );
}

export default App;