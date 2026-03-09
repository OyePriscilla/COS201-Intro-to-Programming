import { useState } from "react";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email first.");
        navigate("/verify");
        return;
      }

      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Google users are always verified
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
      />

      <button onClick={handleLogin} style={{ padding: "10px 20px", marginBottom: "10px" }}>
        Login
      </button>

      <button onClick={handleGoogleLogin} style={{ padding: "10px 20px", background: "#4285F4", color: "white" }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;