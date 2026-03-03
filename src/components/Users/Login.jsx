import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FIrestore/firebase";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      onLogin(userCredential.user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-portal">
      <div className="login-overlay"></div>

      {/* Branding + Date & Time */}
      <div className="login-date">
        <h1 className="org-title">
          Welcome To<br></br> NAS Power Generation
        </h1>

        <div className="time">
          {dateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="date">
          {dateTime.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Login Card */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <h2 className="card-title text-center">Login here</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="form-group">
              <label className="text-secondary">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {/* Password */}
            <div className="form-group">
              <label className="text-secondary">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
