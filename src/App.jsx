import { useState } from "react";
import IssueForm from "./IssueForm";
import Dashboard from "./Dashboard";
import "./App.css";

const IconReport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

function App() {
  const [page, setPage] = useState("report");

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-dot" />
            CivicFix <span className="brand-ai">AI</span>
          </div>
          <nav className="navbar-tabs">
            <button
              className={`tab-btn ${page === "report" ? "tab-btn--active" : ""}`}
              onClick={() => setPage("report")}
            >
              <IconReport />
              Report Issue
            </button>
            <button
              className={`tab-btn ${page === "dashboard" ? "tab-btn--active" : ""}`}
              onClick={() => setPage("dashboard")}
            >
              <IconDashboard />
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {page === "report" ? <IssueForm /> : <Dashboard />}
      </main>
    </div>
  );
}

export default App;