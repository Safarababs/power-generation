import React, { useState } from "react";
import { FaBolt, FaClock } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const EngineReadingsEntry = () => {
  const todayDefault = new Date().toISOString().split("T")[0]; // default to today
  const [operatorName, setOperatorName] = useState("");
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [readings, setReadings] = useState(
    Array(5).fill({ kwh: "", rhrs: "" }), // 5 engines
  );
  const [errors, setErrors] = useState(
    Array(5).fill({ kwh: false, rhrs: false }), // track invalid inputs separately
  );

  // Handle input change
  const handleChange = (index, field, value) => {
    const newReadings = [...readings];
    newReadings[index] = { ...newReadings[index], [field]: Number(value) };
    setReadings(newReadings);

    // Reset error for that specific field when user edits
    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [field]: false };
    setErrors(newErrors);
  };

  // Submit readings
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entryDate) {
      alert("Please select a date for these readings.");
      return;
    }

    // Yesterday = entryDate - 1 day
    const yesterdayDate = new Date(entryDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

    try {
      // 1. Fetch yesterday’s readings
      let yesterdayData = [];
      const yesterdayDoc = await getDoc(
        doc(db, "engineReadings", yesterdayKey),
      );
      if (yesterdayDoc.exists()) {
        yesterdayData = yesterdayDoc.data().readings;
      }

      let hasError = false;
      let newErrors = [...errors];

      // 2. Compute generation + validate
      const generation = readings.map((engine, index) => {
        const yesterdayEngine = yesterdayData[index] || { kwh: 0, rhrs: 0 };
        const diffKwh = engine.kwh - yesterdayEngine.kwh;
        const diffRhrs = engine.rhrs - yesterdayEngine.rhrs;

        // ✅ Validation for kWh
        if (diffKwh < 0 || diffKwh > 200000) {
          hasError = true;
          newErrors[index] = { ...newErrors[index], kwh: true };
        }

        // ✅ Validation for Running Hours
        if (diffRhrs < 0 || diffRhrs > 24) {
          hasError = true;
          newErrors[index] = { ...newErrors[index], rhrs: true };
        }

        return { kwh: diffKwh, rhrs: diffRhrs };
      });

      // ✅ Update errors once after the loop
      setErrors(newErrors);

      // Stop if invalid
      if (hasError) {
        alert("Some readings are invalid. Please correct highlighted fields.");
        return;
      }

      // 3. Save readings under chosen date
      await setDoc(doc(db, "engineReadings", entryDate), {
        operatorName,
        date: entryDate,
        readings,
        generation,
      });

      alert("Readings saved successfully!");
      // ✅ Reset all fields after successful save
      setOperatorName("");
      setEntryDate(todayDefault);
      setReadings(Array(5).fill({ kwh: "", rhrs: "" }));
      setErrors(Array(5).fill({ kwh: false, rhrs: false }));
    } catch (error) {
      console.error("Error saving readings: ", error);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-6">Engine Readings Entry</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Operator Name */}
          <div className="col-span-full">
            <label className="text-secondary font-medium mb-2 block">
              Operator Name
            </label>
            <input
              type="text"
              placeholder="Enter Your name"
              className="w-full p-2 border rounded mb-4"
              required
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
            />
          </div>

          {/* Date Picker */}
          <div className="col-span-full">
            <label className="text-secondary font-medium mb-2 block">
              Reading Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-4"
              required
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>

          {/* Engine Inputs */}
          {readings.map((engine, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Engine {index + 1}</h3>
              <div className="mb-4">
                <label className="flex items-center text-secondary font-medium mb-2">
                  <FaBolt
                    size={18}
                    style={{ color: "#f59e0b", marginRight: "0.5rem" }}
                  />
                  KWH Reading
                </label>
                <input
                  type="number"
                  value={engine.kwh}
                  onChange={(e) => handleChange(index, "kwh", e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={
                    errors[index].kwh
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
                  required
                />
              </div>
              <div>
                <label className="flex items-center text-secondary font-medium mb-2">
                  <FaClock
                    size={18}
                    style={{ color: "#3b82f6", marginRight: "0.5rem" }}
                  />
                  Running Hours (Rhrs)
                </label>
                <input
                  type="number"
                  value={engine.rhrs}
                  onChange={(e) => handleChange(index, "rhrs", e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={
                    errors[index].rhrs
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
                  required
                />
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Submit Readings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineReadingsEntry;
