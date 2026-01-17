import React, { useState } from "react";
import SignUpForm from "./SignUp";
import LoginForm from "./Login";

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login"); // "login" or "signup"

  return (
    <div
      style={{
        marginTop: "2rem",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "100%",
        width: "90%",
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      {/* Main container stretched to 90% */}
      <div className="w-[90%] max-w-5xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">
          {mode === "login" ? "Login to Your Account" : "Employee Registration"}
        </h2>

        {/* Form area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mode === "login" ? <LoginForm /> : <SignUpForm />}
        </div>

        {/* Switcher */}
        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-gray-700 dark:text-gray-300">
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
