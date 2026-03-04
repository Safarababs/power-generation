import React, { useState } from "react";
import { db } from "../../FIrestore/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddAlerts = ({ currentUser }) => {
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("critical");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "alerts"), {
        area,
        description,
        type,
        createdAt: serverTimestamp(),
        approved: false,
        createdBy: {
          name: currentUser?.name, // "Safar Abbas"
          email: currentUser?.email, // "safarabbas73.sa@gmail.com"
          department: currentUser?.department, // "developer"
          empNumber: currentUser?.empNumber, // "058"
        },
      });

      alert("Alert submitted for manager approval!");
      setArea("");
      setDescription("");
      setType("critical");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="form-input"
        placeholder="Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
      />
      <textarea
        className="form-input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        className="form-input"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="critical">Critical</option>
        <option value="non-critical">Non-Critical</option>
        <option value="info">Information Only</option>
      </select>
      <button type="submit" className="btn btn-warning w-full">
        Submit Alert
      </button>
    </form>
  );
};

export default AddAlerts;
