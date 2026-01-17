import React, { useState } from "react";
import { auth } from "../FIrestore/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      alert("Login successful!");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google user logged in:", result.user);
      alert("Google login successful!");
    } catch (error) {
      console.error("Error with Google login:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-gray-50 dark:bg-gray-700 
             text-gray-900 dark:text-gray-100 
             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-gray-50 dark:bg-gray-700 
             text-gray-900 dark:text-gray-100 
             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
             text-white font-semibold rounded-lg 
             hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
             text-white font-semibold rounded-lg 
             hover:opacity-90 transition duration-300"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
