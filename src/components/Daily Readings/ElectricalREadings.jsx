import React, { useState, useEffect } from "react";
import { FaBolt, FaClock } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const EngineReadingsEntry = ({ currentUser }) => {
  const todayDefault = new Date().toISOString().split("T")[0]; // default to today
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [readings, setReadings] = useState(
    Array(5).fill({ kwh: "", rhrs: "" }), // 5 engines
  );
  const [errors, setErrors] = useState(
    Array(5).fill({ kwh: false, rhrs: false }), // track invalid inputs separately
  );
  const [previousReadings, setPreviousReadings] = useState(
    Array(5).fill({ kwh: "", rhrs: "" }),
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
          console.warn(`Engine ${index + 1} invalid kWh diff: ${diffKwh}`);
          hasError = true;
          newErrors[index] = { ...newErrors[index], kwh: true };
        }

        // ✅ Validation for Running Hours
        if (diffRhrs < 0 || diffRhrs > 24) {
          console.warn(`Engine ${index + 1} invalid Rhrs diff: ${diffRhrs}`);
          hasError = true;
          newErrors[index] = { ...newErrors[index], rhrs: true };
        }

        return { kwh: diffKwh, rhrs: diffRhrs };
      });

      // ✅ Update errors once after the loop
      setErrors(newErrors);

      // Stop if invalid
      if (hasError) {
        console.log("Validation errors:", newErrors);
        alert("Some readings are invalid. Please correct highlighted fields.");
        return;
      }

      // 3. Save readings under chosen date
      await setDoc(doc(db, "engineReadings", entryDate), {
        date: entryDate,
        readings,
        generation,
        createdBy: {
          name: currentUser?.name, // "Safar Abbas"
          email: currentUser?.email, // "safarabbas73.sa@gmail.com"
          department: currentUser?.department, // "developer"
          empNumber: currentUser?.empNumber, // "058"
        },
      });

      alert("Readings saved successfully!");
      // ✅ Reset all fields after successful save

      setEntryDate(todayDefault);
      setReadings(Array(5).fill({ kwh: "", rhrs: "" }));
      setErrors(Array(5).fill({ kwh: false, rhrs: false }));
    } catch (error) {
      console.error("Error saving readings: ", error);
    }
  };

  useEffect(() => {
    const fetchPrevious = async () => {
      const yesterdayDate = new Date(entryDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

      const yesterdayDoc = await getDoc(
        doc(db, "engineReadings", yesterdayKey),
      );
      if (yesterdayDoc.exists()) {
        setPreviousReadings(yesterdayDoc.data().readings || []);
      }
    };

    fetchPrevious();
  }, [entryDate]); // runs whenever entryDate changes

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-6">Engine Readings Entry</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Date Picker */}
          <div className="col-span-full">
            <label className="text-secondary font-medium mb-2 block">
              Reading Date
            </label>
            <input
              type="date"
              className="form-input"
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
                  <FaClock
                    size={18}
                    style={{ color: "#3b82f6", marginRight: "0.5rem" }}
                  />
                  Running Hours (Rhrs)
                </label>
                <input
                  type="number"
                  step="any"
                  value={engine.rhrs}
                  onChange={(e) => handleChange(index, "rhrs", e.target.value)}
                  placeholder={previousReadings[index]?.rhrs || "Enter Rhrs"}
                  className="form-input"
                  style={
                    errors[index].rhrs
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
                  required
                />
              </div>
              <div>
                <label className="flex items-center text-secondary font-medium mb-2">
                  <FaBolt
                    size={18}
                    style={{ color: "#f59e0b", marginRight: "0.5rem" }}
                  />
                  KWH Reading
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={engine.kwh}
                  placeholder={previousReadings[index]?.kwh || "Enter KWH"}
                  onChange={(e) => handleChange(index, "kwh", e.target.value)}
                  className="form-input"
                  style={
                    errors[index].kwh
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
            <button type="submit" className="btn-primary">
              Submit Readings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineReadingsEntry;
