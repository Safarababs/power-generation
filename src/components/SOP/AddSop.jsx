import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const AddSOPForm = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([""]);

  const addStepField = () => setSteps([...steps, ""]);

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const saveSOP = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      // Use SOP title as document ID
      const sopRef = doc(db, "sops", title.trim());
      await setDoc(sopRef, {
        title: title.trim(),
        steps: steps.filter((s) => s.trim() !== ""),
        createdBy: {
          name: currentUser?.name, // "Safar Abbas"
          email: currentUser?.email, // "safarabbas73.sa@gmail.com"
          department: currentUser?.department, // "developer"
          empNumber: currentUser?.empNumber, // "058"
        },
      });
      alert("SOP saved successfully!");
      setTitle("");
      setSteps([""]);
    } catch (err) {
      console.error("Error saving SOP:", err);
      alert("Failed to save SOP");
    }
  };

  return (
    <div className="card p-4 space-y-4">
      <h2 className="card-title">Add New SOP</h2>

      <input
        type="text"
        placeholder="Enter SOP Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input w-full"
      />

      <div className="space-y-2">
        {steps.map((step, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Step ${idx + 1}`}
            value={step}
            onChange={(e) => updateStep(idx, e.target.value)}
            className="form-input w-full"
          />
        ))}
        <button
          type="button"
          onClick={addStepField}
          className="btn btn-secondary mt-2"
        >
          + Add Step
        </button>
      </div>

      <button type="button" onClick={saveSOP} className="btn btn-primary mt-4">
        Save SOP
      </button>
    </div>
  );
};

export default AddSOPForm;
