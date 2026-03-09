import { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyNotice() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email first by clicking the link sent to your inbox.");
        return;
      }

      alert("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Verify Your Email</h2>
      <p>
        A verification link has been sent to your email. Please check your inbox and click the link to verify.
      </p>
      <p>Once verified, you can log in below:</p>

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

      <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
        Login
      </button>
    </div>
  );
}