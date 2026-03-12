import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

export default function MonthlyPreviousRecord({ currentUser }) {
  const [month, setMonth] = useState("");
  const [engineId, setEngineId] = useState("E1");
  const [starts, setStarts] = useState("");
  const [stops, setStops] = useState("");
  const [loading, setLoading] = useState(false);

  const engines = ["E1", "E2", "E3", "E4", "E5"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month) return alert("Select month");
    const diff1 = stops - starts;
    const diff2 = starts - stops;

    if (diff1 > 1 || diff2 > 1)
      return alert("Start and Stop difference can not greater that 1");
    setLoading(true);

    try {
      const monthKey = month.replace("-", "_");

      await setDoc(
        doc(db, "engine_start_stop", monthKey),
        {
          [engineId]: {
            starts: Number(starts),
            stops: Number(stops),
            createdBy: {
              name: currentUser?.name, // "Safar Abbas"
              email: currentUser?.email, // "safarabbas73.sa@gmail.com"
              department: currentUser?.department, // "developer"
              empNumber: currentUser?.empNumber, // "058"
            },
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
    <div
      className="container max-w-md mx-auto p-6 rounded-lg shadow-md 
                    bg-[var(--surface-color)] text-[var(--text-primary)] space-y-6"
    >
      <h2 className="text-xl font-bold border-b border-[var(--border-color)] pb-2">
        Monthly Previous Starts / Stops Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Month */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            className="form-select"
          />
        </div>

        {/* Engine */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Engine</label>
          <select
            value={engineId}
            onChange={(e) => setEngineId(e.target.value)}
            className="form-select"
          >
            {engines.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Starts */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Total Starts</label>
          <input
            type="number"
            value={starts}
            onChange={(e) => setStarts(e.target.value)}
            required
            className="form-select"
          />
        </div>

        {/* Stops */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Total Stops</label>
          <input
            type="number"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
            required
            className="form-select"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={
            loading
              ? {
                  color: "white",
                  backgroundColor: "gray",
                  cursor: "not-allowed",
                }
              : { color: "white", backgroundColor: "var(--primary-color)" }
          }
        >
          {loading ? "Saving..." : "Save Record"}
        </button>
      </form>
    </div>
  );
}
