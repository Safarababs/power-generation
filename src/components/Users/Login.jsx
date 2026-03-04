import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../FIrestore/firebase";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Fetch Firestore profile
      const docRef = doc(db, "teamMembers", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || !docSnap.data().approved) {
        // Not approved → block login
        await signOut(auth);
        alert("Your account is pending approval by a developer.");
        return;
      }

      // Approved → proceed
      onLogin(user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 fade-in">
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary w-full text-primary">
        Login
      </button>

      <p className="text-center text-sm text-secondary m-2">
        Don’t have an account?{" "}
      </p>
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="btn-primary w-full text-primary hover:underline"
      >
        Register here
      </button>
    </form>
  );
};

export default LoginForm;
