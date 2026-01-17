import React, { useState } from "react";
import { auth, db } from "../FIrestore/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "teamMembers", user.uid), {
        email: user.email,
        designation: "Operator", // default for now
        createdAt: new Date(),
      });

      console.log("User signed up:", user);
      alert("Sign up successful!");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info in Firestore
      await setDoc(doc(db, "teamMembers", user.uid), {
        email: user.email,
        designation: "Operator", // default for now
        createdAt: new Date(),
      });

      console.log("Google user signed in:", user);
      alert("Google sign in successful!");
    } catch (error) {
      console.error("Error with Google sign in:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignUp}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
