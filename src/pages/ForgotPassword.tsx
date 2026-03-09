import { useState } from "react";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleReset}>Send Reset Link</button>
    </div>
  );
}