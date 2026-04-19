import { useState } from "react";


// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "2rem",
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "1.5rem",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "#4F46E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#111",
  },
  logoAccent: {
    color: "#4F46E5",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111",
    margin: "0 0 4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "0 0 1.5rem",
  },
  tabRow: {
    display: "flex",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  tab: (active) => ({
    flex: 1,
    padding: "8px",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
    border: "none",
    backgroundColor: active ? "#4F46E5" : "transparent",
    color: active ? "#fff" : "#6B7280",
    transition: "all 0.15s ease",
  }),
  fieldWrap: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#374151",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #D1D5DB",
    backgroundColor: "#F9FAFB",
    color: "#111",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  submitBtn: {
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    backgroundColor: "#4F46E5",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginTop: "0.25rem",
    transition: "opacity 0.15s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "1.25rem 0",
  },
  dividerLine: {
    flex: 1,
    border: "none",
    borderTop: "1px solid #E5E7EB",
    margin: 0,
  },
  dividerText: {
    fontSize: "12px",
    color: "#9CA3AF",
  },
  googleBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #D1D5DB",
    backgroundColor: "#fff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.15s",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    borderRadius: "10px",
    fontSize: "13px",
    padding: "9px 12px",
    marginBottom: "1rem",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6B7280",
    marginTop: "1.25rem",
  },
  footerLink: {
    color: "#4F46E5",
    cursor: "pointer",
    fontWeight: "500",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "13px",
  },
};

// ─── Google icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.47c-.28 1.48-1.12 2.73-2.39 3.57v2.96h3.87c2.26-2.08 3.55-5.16 3.55-8.56z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-2.96c-1.07.72-2.44 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.28v3.05C3.24 21.3 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.27 14.32A7.17 7.17 0 0 1 4.86 12c0-.81.14-1.6.41-2.32V6.63H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.37l3.99-3.05z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0 7.31 0 3.24 2.7 1.28 6.63l3.99 3.05C6.22 6.86 8.87 4.75 12 4.75z"/>
  </svg>
);

// ─── AuthForm component ───────────────────────────────────────────────────────
export default function AuthForm({
  onLogin,
  onSignup,
  onGoogleSignIn,
  errorMessage,
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputFocus, setInputFocus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin?.(email, password);
    } else {
      onSignup?.(email, password);
    }
  };

  const focusStyle = (field) =>
    inputFocus === field
      ? { ...styles.input, borderColor: "#4F46E5", boxShadow: "0 0 0 3px rgba(79,70,229,0.12)" }
      : styles.input;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white" />
            </svg>
          </div>
          <span style={styles.logoText}>
            Civic<span style={styles.logoAccent}>Fix</span> AI
          </span>
        </div>

        {/* Heading */}
        <h1 style={styles.title}>
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p style={styles.subtitle}>
          {isLogin
            ? "Sign in to your account to continue"
            : "Join CivicFix AI to get started"}
        </p>

        {/* Tab switcher */}
        <div style={styles.tabRow} role="tablist">
          <button
            role="tab"
            aria-selected={isLogin}
            style={styles.tab(isLogin)}
            onClick={() => setIsLogin(true)}
          >
            Sign in
          </button>
          <button
            role="tab"
            aria-selected={!isLogin}
            style={styles.tab(!isLogin)}
            onClick={() => setIsLogin(false)}
          >
            Create account
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div style={styles.errorBox} role="alert">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldWrap}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setInputFocus("email")}
              onBlur={() => setInputFocus(null)}
              style={focusStyle("email")}
            />
          </div>

          <div style={styles.fieldWrap}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setInputFocus("password")}
              onBlur={() => setInputFocus(null)}
              style={focusStyle("password")}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <hr style={styles.dividerLine} />
        </div>

        {/* Google sign-in */}
        <button style={styles.googleBtn} onClick={onGoogleSignIn} type="button">
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Footer toggle */}
        <p style={styles.footer}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            style={styles.footerLink}
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}