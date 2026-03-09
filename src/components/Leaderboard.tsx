import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LeaderboardEntry {
  studentName: string;
  courseTitle: string;
  score: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, "quizResults"),
          orderBy("score", "desc"), // highest score first
          limit(10) // top 10
        );
        const snapshot = await getDocs(q);
        const data: LeaderboardEntry[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            studentName: d.studentName || "Student",
            courseTitle: d.courseTitle,
            score: d.score,
          };
        });
        setEntries(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (entries.length === 0) return <p>No leaderboard data available.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>🏆 Top 10 Students Leaderboard</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>#</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Student</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Course</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{index + 1}</td>
              <td style={{ padding: "8px" }}>{entry.studentName}</td>
              <td style={{ padding: "8px" }}>{entry.courseTitle}</td>
              <td style={{ padding: "8px" }}>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}