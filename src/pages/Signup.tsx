import { useState } from "react";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name.trim()) {
      alert("Please enter your full name");
      return;
    }

    try {
      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName: name });

      // Send verification email
      await sendEmailVerification(user);

      alert("Signup successful! Verification email sent. Check your inbox.");
      
      // Redirect to verify page
      navigate("/verify");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
      />

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

      <button onClick={handleSignup} style={{ padding: "10px 20px" }}>
        Signup
      </button>
    </div>
  );
}