import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import PaystackButton from "../components/PayStackButton";

interface Lesson {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string; // Optional course-level PDF
  lessons: Lesson[];
}

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("Student");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserName(user.displayName || user.email || "Student");

    setCourses([
      {
        id: "course1",
        title: "Computer Programming I Using Python",
        description:
          "Learn Python programming basics, including mathematical operations, variables, data types, and practical experience in writing, testing, and debugging small programs.",
        pdfUrl: "/pdfs/Lecture_1_COS_201.pdf",
        lessons: [
          { id: "lesson1", title: "What is knowledge? (Declarative vs. Imperative)" },
          { id: "lesson2", title: "Understanding Algorithms and Recipes" },
          { id: "lesson3", title: "Computer Architecture: Fixed vs. Stored Programs" },
          { id: "lesson4", title: "Programming Language Aspects: Primitives, Syntax, and Semantics" },
          { id: "lesson5", title: "Types of Programming Errors (Syntactic, Static Semantic, and Runtime)" },
          { id: "lesson6", title: "Objects in Python: Numbers, Strings, Booleans, and Lists" }
        ]
      },
      {
        id: "course2",
        title: "Python Strings, I/O, and Branching",
        description: "Master text processing and control flow, covering string manipulation, standard input/output (I/O) functions, and conditional branching logic.",
        pdfUrl: "/pdfs/Lecture_2_COS_201-Python_Strings_I_O_Branching.pdf",
        lessons: [
          { id: "lesson1", title: "Introduction to Strings and Immutability" },
          { id: "lesson2", title: "String Operations: Concatenation and Repetition" },
          { id: "lesson3", title: "Indexing and Slicing Techniques" },
          { id: "lesson4", title: "Standard Input/Output (input and print)" },
          { id: "lesson5", title: "Comparison Operators and Boolean Logic" },
          { id: "lesson6", title: "Control Flow: If, Elif, and Else Statements" }
        ]
      },
      {
        id: "course3",
        title: "Mastery of Loops in Programming",
        description: "Learn efficient automation and iterative logic control, covering fundamental mechanics, state management, and the different types of computational loops.",
        pdfUrl: "/pdfs/Lecture_3_Mastery_of_Loops_in_Programming.pdf",
        lessons: [
          { id: "lesson1", title: "The Anatomy of Iteration: Initializers" },
          { id: "lesson2", title: "Termination Conditions and Exit Logic" },
          { id: "lesson3", title: "The While Loop: Entry-Controlled Logic" },
          { id: "lesson4", title: "The For Loop: Definite Iteration" },
          { id: "lesson5", title: "The Do-While Loop: Exit-Controlled Logic" },
          { id: "lesson6", title: "Infinite Loops and Safety Nets" }
        ]
      },
      {
        id: "course4",
        title: "Object-Oriented Programming Strategy",
        description: "Learn to architect scalable software systems by reimagining programs as collections of interacting objects, focusing on design, architecture, and performance.",
        pdfUrl: "/pdfs/Lecture_4_Object-Oriented_Programming.pdf",
        lessons: [
          { id: "lesson1", title: "The Paradigm Shift: Procedure to Object" },
          { id: "lesson2", title: "Classes vs. Objects: Blueprints and Instances" },
          { id: "lesson3", title: "Encapsulation: Data Hiding and Protection" },
          { id: "lesson4", title: "Abstraction: Focusing on 'What' over 'How'" },
          { id: "lesson5", title: "Inheritance: Hierarchy and Code Reusability" },
          { id: "lesson6", title: "Polymorphism: One Interface, Many Forms" }
        ]
      },
      {
        id: "course6",
        title: "Introduction to Python Programming",
        description: "A comprehensive introduction to the Python language, covering computer science foundations, problem-solving, and the syntax required for software development.",
        pdfUrl: "/pdfs/Introduction_to_Python_Programming_OpenStax.pdf",
        lessons: [
          { id: "lesson1", title: "Introduction to Computing and Python" },
          { id: "lesson2", title: "Variables, Expressions, and Statements" },
          { id: "lesson3", title: "The Flow of Execution: Conditionals" },
          { id: "lesson4", title: "Functions and Modular Programming" },
          { id: "lesson5", title: "Iteration and Nested Loop Structures" },
          { id: "lesson6", title: "Data Structures: Lists and Dictionaries" }
        ]
      },
    ]);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Welcome, {userName}</h2>
        <button
          onClick={handleLogout}
          style={{ background: "#dc3545", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {/* Courses */}
      <h3>Topics</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "20px",
              background: "#fff",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}
          >
            <h4>{course.title}</h4>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>{course.description}</p>

            <strong>Lessons</strong>
            <ul style={{ paddingLeft: "18px", marginTop: "10px" }}>
              {course.lessons.map((lesson) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
            </ul>

            {/* Action Buttons for the Course */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
              {course.pdfUrl && (
                <>
                  {/* Read PDF */}
                  <a
                    href={course.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#007bff",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "13px"
                    }}
                  >
                    Read PDF
                  </a>

                  {/* Download PDF */}
                  <a
                    href={course.pdfUrl}
                    download
                    style={{
                      background: "#28a745",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "13px"
                    }}
                  >
                    Download PDF
                  </a>
                </>
              )}

              {/* Take Quiz */}
              <Link
                to={`/quiz/${course.id}/${course.lessons[0].id}`}
                style={{
                  background: "#ffc107",
                  color: "#333",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "13px"
                }}
              >
                Take Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div style={{ marginTop: "60px", borderTop: "1px solid #eee", paddingTop: "30px", textAlign: "center" }}>
        <h3>Support This Learning Platform</h3>
        <p style={{ color: "#666" }}>
          If this platform helps you learn, you can support its development.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
          <PaystackButton amount={500} label="☕ ₦500" />
          <PaystackButton amount={1000} label="☕ ₦1000" />
          <PaystackButton amount={2000} label="☕ ₦2000" />
        </div>
      </div>
    </div>
  );
}