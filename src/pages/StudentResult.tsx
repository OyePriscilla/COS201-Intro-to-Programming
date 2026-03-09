import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

interface Answer {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

interface QuizResult {
  id: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  studentName: string;
}

export default function StudentResults() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null); // track which result is expanded
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const data: QuizResult[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            courseTitle: d.courseTitle,
            score: d.score,
            totalQuestions: d.totalQuestions,
            answers: d.answers,
            studentName: d.studentName || auth.currentUser?.displayName || "Student",
          };
        });

        setResults(data);
        if (data.length > 0) setExpanded(data[0].id); // expand latest result by default
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const downloadPDF = (result: QuizResult) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Quiz Result - ${result.courseTitle}`, 10, 15);
    doc.setFontSize(12);
    doc.text(`Student: ${result.studentName}`, 10, 25);
    doc.text(
      `Score: ${result.score} / ${result.totalQuestions} (${(
        (result.score / result.totalQuestions) *
        100
      ).toFixed(2)}%)`,
      10,
      32
    );

    let y = 45;
    result.answers.forEach((ans, idx) => {
      const status = ans.isCorrect ? "✅ Correct" : "❌ Wrong";
      doc.text(`${idx + 1}. ${ans.question}`, 10, y);
      y += 6;
      doc.text(`Your Answer: ${ans.selected}`, 12, y);
      y += 6;
      if (!ans.isCorrect) {
        doc.text(`Correct Answer: ${ans.correct}`, 12, y);
        y += 6;
      }
      doc.text(`Result: ${status}`, 12, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${result.courseTitle}_Result.pdf`);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading results...</p>;
  if (results.length === 0)
    return <p style={{ textAlign: "center" }}>No quiz results found.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "30px" }}>
      <h2>Quiz Results 📊</h2>
      {results.map((result) => {
        const isOpen = expanded === result.id;
        return (
          <div
            key={result.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "15px",
              background: "#f9f9f9",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#e0e0e0",
              }}
              onClick={() => toggleExpand(result.id)}
            >
              <h3 style={{ margin: 0 }}>{result.courseTitle}</h3>
              <span>{isOpen ? "▲ Collapse" : "▼ Expand"}</span>
            </div>

            {isOpen && (
              <div style={{ padding: "15px 20px" }}>
                <h4>Student: {result.studentName}</h4>
                <h4>
                  Score: {result.score} / {result.totalQuestions} (
                  {((result.score / result.totalQuestions) * 100).toFixed(2)}%)
                </h4>

                <div style={{ marginTop: "15px" }}>
                  {result.answers.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "6px",
                        background: item.isCorrect ? "#e8f5e9" : "#ffebee",
                      }}
                    >
                      <p>
                        <strong>Question:</strong> {item.question}
                      </p>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        <span style={{ color: item.isCorrect ? "green" : "red" }}>
                          {item.selected}
                        </span>
                      </p>
                      {!item.isCorrect && (
                        <p>
                          <strong>Correct Answer:</strong>{" "}
                          <span style={{ color: "green" }}>{item.correct}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => downloadPDF(result)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#28a745",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Download Result (PDF)
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}