import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const AddSOPForm = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [steps, setSteps] = useState([{ heading: "", details: [""] }]);
  const [safetyNotes, setSafetyNotes] = useState([""]);

  // Add new step section
  const addStepSection = () =>
    setSteps([...steps, { heading: "", details: [""] }]);

  // Update step heading
  const updateStepHeading = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].heading = value;
    setSteps(newSteps);
  };

  // Update step detail
  const updateStepDetail = (stepIndex, detailIndex, value) => {
    const newSteps = [...steps];
    newSteps[stepIndex].details[detailIndex] = value;
    setSteps(newSteps);
  };

  // Add detail line to a step
  const addDetailLine = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].details.push("");
    setSteps(newSteps);
  };

  // Add safety note
  const addSafetyNote = () => setSafetyNotes([...safetyNotes, ""]);

  const updateSafetyNote = (index, value) => {
    const newNotes = [...safetyNotes];
    newNotes[index] = value;
    setSafetyNotes(newNotes);
  };

  const saveSOP = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    try {
      const sopRef = doc(db, "sops", title.trim());
      await setDoc(sopRef, {
        isApproved: false,
        title: title.trim(),
        objective: objective.trim(),
        steps: steps.map((s) => ({
          heading: s.heading.trim(),
          details: s.details.filter((d) => d.trim() !== ""),
        })),
        safetyNotes: safetyNotes.filter((n) => n.trim() !== ""),
        createdBy: {
          name: currentUser?.name,
          email: currentUser?.email,
          department: currentUser?.department,
          empNumber: currentUser?.empNumber,
        },
      });
      alert("SOP saved successfully!");
      setTitle("");
      setObjective("");
      setSteps([{ heading: "", details: [""] }]);
      setSafetyNotes([""]);
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

      <textarea
        placeholder="Enter Objective"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        className="form-input w-full"
      />

      {steps.map((step, idx) => (
        <div key={idx} className="space-y-2 border p-2 rounded">
          <input
            type="text"
            placeholder={`Step ${idx + 1} Heading`}
            value={step.heading}
            onChange={(e) => updateStepHeading(idx, e.target.value)}
            className="form-input w-full"
          />
          {step.details.map((detail, dIdx) => (
            <input
              key={dIdx}
              type="text"
              placeholder={`Detail ${dIdx + 1}`}
              value={detail}
              onChange={(e) => updateStepDetail(idx, dIdx, e.target.value)}
              className="form-input w-full"
            />
          ))}
          <button
            type="button"
            onClick={() => addDetailLine(idx)}
            className="btn btn-secondary"
          >
            + Add Detail
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addStepSection}
        className="btn btn-secondary"
      >
        + Add Step Section
      </button>

      <h3 className="card-title mt-4">Safety Notes</h3>
      {safetyNotes.map((note, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Safety Note ${idx + 1}`}
          value={note}
          onChange={(e) => updateSafetyNote(idx, e.target.value)}
          className="form-input w-full"
        />
      ))}
      <button
        type="button"
        onClick={addSafetyNote}
        className="btn btn-secondary"
      >
        + Add Safety Note
      </button>

      <button type="button" onClick={saveSOP} className="btn btn-primary mt-4">
        Save SOP
      </button>
    </div>
  );
};

export default AddSOPForm;
