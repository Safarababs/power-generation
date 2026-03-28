import React, { useState } from "react";
import { auth, db } from "../FIrestore/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [empNumber, setEmpNumber] = useState("");
  const [department, setDepartment] = useState("operation");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "teamMembers", user.uid), {
        email: user.email,
        name,
        designation,
        empNumber,
        department,
        approved: false, // default until developer approves
        createdAt: new Date(),
      });

      alert("Registration submitted! Awaiting developer approval.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <input
        type="text"
        className="form-input"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        className="form-input"
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        required
      />

      <input
        type="text"
        className="form-input"
        placeholder="Employee Number"
        value={empNumber}
        onChange={(e) => setEmpNumber(e.target.value)}
        required
      />

      <select
        className="form-input"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      >
        <option value="operation">Select Department</option>
        <option value="executive">Executive</option>
        <option value="operation">Operation</option>
        <option value="E&i">E&I</option>
        <option value="mechanical">Mechanical</option>
        <option value="uty">UTY</option>
        <option value="services">Services</option>
        <option value="developer">Developer</option>
      </select>

      <input
        type="email"
        className="form-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="form-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="btn-primary w-full">
        Sign Up
      </button>

      <p className="text-center text-sm text-secondary m-2">
        Already have an account?{" "}
      </p>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="btn-primary w-full text-blue hover:underline"
      >
        Login here
      </button>
    </form>
  );
};

export default SignUpForm;
