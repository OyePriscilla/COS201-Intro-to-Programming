import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { quizData } from "../data/quizData";

import { auth, db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { jsPDF } from "jspdf";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

export default function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const questions: Question[] = quizData[courseId as string] || [];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const user = auth.currentUser;
  const studentName = user?.displayName || user?.email || "Student";
  const dateTaken = new Date().toLocaleDateString();
  const courseTitle = courseId ? courseId : "Course";

  // Save quiz result to Firestore
  const saveQuizResult = async (
    finalScore: number,
    total: number,
    answersData: any[]
  ) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "quizResults"), {
        userId: user.uid,
        userEmail: user.email,
        courseId: courseId,
        score: finalScore,
        totalQuestions: total,
        percentage: ((finalScore / total) * 100).toFixed(2) + "%",
        answers: answersData,
        studentName: studentName,
        dateTaken: dateTaken,
        courseTitle: courseTitle,
        createdAt: serverTimestamp()
      });

      console.log("Quiz result saved successfully");
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Handle answer selection
  const handleAnswer = async (index: number) => {
    const question = questions[currentQuestion];

    const isCorrect = index === question.answer;

    const answerRecord = {
      question: question.question,
      selected: question.options[index],
      correct: question.options[question.answer],
      isCorrect: isCorrect
    };

    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);

    if (isCorrect) setScore(score + 1);

    const next = currentQuestion + 1;

    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setLoading(true);
      await saveQuizResult(score + (isCorrect ? 1 : 0), questions.length, updatedAnswers);
      setShowResult(true);
      setLoading(false);
    }
  };

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Quiz Result", 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 10, y);
    y += 7;
    doc.text(`Course: ${courseTitle}`, 10, y);
    y += 7;
    doc.text(`Date: ${dateTaken}`, 10, y);
    y += 7;
    const percentage = ((score / questions.length) * 100).toFixed(2);
    doc.text(`Score: ${score} / ${questions.length} (${percentage}%)`, 10, y);

    y += 10;

    answers.forEach((item, index) => {
      doc.text(`Q${index + 1}: ${item.question}`, 10, y);
      y += 7;
      doc.text(`Your Answer: ${item.selected}`, 10, y);
      y += 7;
      if (!item.isCorrect) {
        doc.text(`Correct Answer: ${item.correct}`, 10, y);
        y += 7;
      }
      doc.text(`Result: ${item.isCorrect ? "Correct" : "Wrong"}`, 10, y);
      y += 12;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save(`quiz-result-${courseId}.pdf`);
  };

  // Display loading state
  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Saving...</h2>;
  }

  // No quiz available
  if (!questions.length) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Quiz not available</h2>;
  }

  // Show result screen
  if (showResult) {
    return (
      <div style={{ maxWidth: "700px", margin: "auto", padding: "30px" }}>
        <h2>Quiz Completed 🎉</h2>
        <h3>Student: {studentName}</h3>
        <h3>Course: {courseTitle}</h3>
        <h3>Date: {dateTaken}</h3>
        <h3>
          Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(2)}%)
        </h3>

        <div style={{ marginTop: "30px" }}>
          {answers.map((item, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                background: item.isCorrect ? "#e8f5e9" : "#ffebee"
              }}
            >
              <p><strong>Question:</strong> {item.question}</p>
              <p>
                <strong>Your Answer:</strong>{" "}
                <span style={{ color: item.isCorrect ? "green" : "red" }}>{item.selected}</span>
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
          onClick={downloadPDF}
          style={{
            marginRight: "10px",
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#28a745",
            color: "white",
            cursor: "pointer"
          }}
        >
          Download Result (PDF)
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "30px" }}>
      <h3>
        Question {currentQuestion + 1} of {questions.length}
      </h3>

      <h2 style={{ marginTop: "20px" }}>{questions[currentQuestion].question}</h2>

      <div style={{ marginTop: "25px" }}>
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "12px",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: "#f8f9fa",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}