import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";

export default function HomePage() {
  const [userName, setUserName] = useState<string>("Student");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserName(user.displayName || user.email || "Student");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa, #fffde7)",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {/* Greeting */}
      <h1 style={{ fontSize: "3rem", marginBottom: "10px", color: "#00796b" }}>
        Welcome, {userName}! 🎉
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "30px" }}>
        Explore your courses, take quizzes, and track your progress.
      </p>

      {/* Leaderboard */}
      <div style={{ width: "100%", maxWidth: "800px", marginBottom: "40px" }}>
        <Leaderboard />
      </div>

      {/* Navigation Links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <NavCard to="/dashboard" color="#007bff" title="Dashboard" />
        <NavCard to="/results" color="#28a745" title="My Results" />
      </div>
    </div>
  );
}

// Navigation card component
const NavCard = ({ to, color, title }: { to: string; color: string; title: string }) => (
  <Link
    to={to}
    style={{
      display: "block",
      padding: "25px 0",
      borderRadius: "12px",
      color: "white",
      fontWeight: "bold",
      textDecoration: "none",
      background: color,
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      textAlign: "center" as const,
      fontSize: "1.1rem",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
    }}
  >
    {title}
  </Link>
);