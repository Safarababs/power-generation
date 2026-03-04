import React, { useState, useEffect } from "react";
import LoginForm from "./Login";
import SignUpForm from "./SignUp";

const AuthPortal = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="login-portal">
      {/* Left side: Branding + Date/Time */}
      <div className="login-date fade-in">
        <h1 className="org-title pulse">
          Welcome To
          <br /> NAS Power Generation
        </h1>
        <div className="time pulse">
          {dateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="date pulse">
          {dateTime.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Right side: Form card */}
      <div className="login-form-wrapper">
        <div className="login-card fade-in">
          <h2 className="card-title text-primary text-center mb-4">
            {mode === "login" ? "Login here" : "Employee Registration"}
          </h2>

          {mode === "login" ? (
            <LoginForm
              onLogin={onLogin}
              onSwitchToRegister={() => setMode("signup")}
            />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
