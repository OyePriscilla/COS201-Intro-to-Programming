import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <Link to="/" style={{ marginRight: 15, color: "white" }}>
        Home
      </Link>

      {!user && (
        <>
          <Link to="/login" style={{ marginRight: 15, color: "white" }}>
            Login
          </Link>

          <Link to="/signup" style={{ marginRight: 15, color: "white" }}>
            Signup
          </Link>
        </>
      )}

      {user && (
        <>
          <Link to="/dashboard" style={{ marginRight: 15, color: "white" }}>
            Dashboard
          </Link>
           <Link to="/results" style={{ marginRight: 15, color: "white" }}>
            My Results
          </Link>

          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}