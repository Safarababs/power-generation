import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

export default function MonthlyPreviousRecord() {
  const [month, setMonth] = useState("");
  const [engineId, setEngineId] = useState("E1");
  const [starts, setStarts] = useState("");
  const [stops, setStops] = useState("");
  const [loading, setLoading] = useState(false);

  const engines = ["E1", "E2", "E3", "E4", "E5"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month) return alert("Select month");
    if (stops > starts) return alert("Stops cannot be greater than Starts");

    setLoading(true);

    try {
      // Convert "2026-01" → "2026_01"
      const monthKey = month.replace("-", "_");

      // Save directly into engine_start_stop collection
      // Each monthKey is a document, each engine is a field
      await setDoc(
        doc(db, "engine_start_stop", monthKey),
        {
          [engineId]: {
            starts: Number(starts),
            stops: Number(stops),
          },
        },
        { merge: true },
      );

      alert("Data saved ✅");

      setStarts("");
      setStops("");
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }

    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2>Monthly Previous Starts / Stops Entry</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Month */}
        <div>
          <label>Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>

        {/* Engine */}
        <div>
          <label>Engine</label>
          <select
            value={engineId}
            onChange={(e) => setEngineId(e.target.value)}
          >
            {engines.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Starts */}
        <div>
          <label>Total Starts</label>
          <input
            type="number"
            value={starts}
            onChange={(e) => setStarts(e.target.value)}
            required
          />
        </div>

        {/* Stops */}
        <div>
          <label>Total Stops</label>
          <input
            type="number"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Record"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "black",
    color: "white",
  },
  form: {
    display: "grid",
    gap: "15px",
  },
};
