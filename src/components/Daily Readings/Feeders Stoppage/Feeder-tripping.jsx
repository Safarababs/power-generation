import React, { useState } from "react";
import { db } from "../../FIrestore/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";

const MillRecordForm = ({ currentUser }) => {
  const { darkMode } = useTheme();
  const [mill, setMill] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [Loading, setLoading] = useState(false);

  const mills = [
    "Cement Mill 1",
    "Cement Mill 2",
    "Cement Mill 3",
    "Raw Mill 1",
    "Raw Mill 2",
    "Kiln 1",
    "Kiln 2",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Validation: stop must be before start
    if (new Date(stopTime) >= new Date(startTime)) {
      alert("Stop time must be before start time.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "millRecords"), {
        mill,
        stopTime: Timestamp.fromDate(new Date(stopTime)),
        startTime: Timestamp.fromDate(new Date(startTime)),
        createdAt: Timestamp.now(),
        createdBy: {
          empNumber: currentUser?.empNumber,
          email: currentUser?.email,
        }, // ✅ lean metadata
      });

      alert("Record saved successfully!");

      setMill("");
      setStopTime("");
      setStartTime("");
    } catch (error) {
      console.error("Error saving record: ", error);
    }

    setLoading(false);
  };

  return (
    <div
      className={`container space-y-6 p-6 rounded-lg shadow-md ${
        darkMode
          ? "bg-[var(--surface-color)] text-[var(--text-primary)]"
          : "bg-[var(--surface-color)] text-[var(--text-primary)]"
      }`}
    >
      <h2 className="text-2xl font-semibold">Mill Stoppage Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Mill</label>
          <select
            value={mill}
            onChange={(e) => setMill(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select Mill</option>
            {mills.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium">Stop Time</label>
          <input
            type="datetime-local"
            value={stopTime}
            onChange={(e) => setStopTime(e.target.value)}
            className="form-select"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn ${Loading ? "btn-disabled m-1" : "btn-primary m-1"}`}
        >
          {Loading ? "Saving..." : "Save Record"}
        </button>
      </form>
    </div>
  );
};

export default MillRecordForm;
