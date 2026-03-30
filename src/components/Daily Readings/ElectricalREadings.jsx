// EngineReadingsEntry.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaBolt, FaClock } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const EngineReadingsEntry = ({ currentUser }) => {
  const todayDefault = new Date().toISOString().split("T")[0];
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [Loading, setLoading] = useState(false);

  const [readings, setReadings] = useState(
    Array(5).fill({ kwh: "", rhrs: "" }),
  );
  const [errors, setErrors] = useState(
    Array(5).fill({ kwh: false, rhrs: false }),
  );
  const [previousReadings, setPreviousReadings] = useState(
    Array(5).fill({ kwh: "", rhrs: "" }),
  );

  // ✅ Cache to avoid duplicate Firestore reads
  const cacheRef = useRef({});

  const handleChange = (index, field, value) => {
    const newReadings = [...readings];
    newReadings[index] = {
      ...newReadings[index],
      [field]: value === "" ? "" : Number(value),
    };
    setReadings(newReadings);

    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [field]: false };
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Loading) return;
    setLoading(true);

    if (!entryDate) {
      alert("Please select a date for these readings.");
      return;
    }

    // Yesterday key
    const yesterdayDate = new Date(entryDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

    try {
      // ✅ Use cache first, fallback to Firestore
      let yesterdayData = cacheRef.current[yesterdayKey] || [];
      if (!yesterdayData.length) {
        const yesterdayDoc = await getDoc(
          doc(db, "engineReadings", yesterdayKey),
        );
        if (yesterdayDoc.exists()) {
          yesterdayData = yesterdayDoc.data().readings;
          cacheRef.current[yesterdayKey] = yesterdayData;
        }
      }

      let hasError = false;
      let newErrors = [...errors];

      const generation = readings.map((engine, index) => {
        const yesterdayEngine = yesterdayData[index] || { kwh: 0, rhrs: 0 };
        const diffKwh = engine.kwh - yesterdayEngine.kwh;
        const diffRhrs = engine.rhrs - yesterdayEngine.rhrs;

        if (diffKwh < 0 || diffKwh > 200000) {
          hasError = true;
          newErrors[index] = { ...newErrors[index], kwh: true };
        }
        if (diffRhrs < 0 || diffRhrs > 24) {
          hasError = true;
          newErrors[index] = { ...newErrors[index], rhrs: true };
        }

        return { kwh: diffKwh, rhrs: diffRhrs };
      });

      setErrors(newErrors);

      if (hasError) {
        alert("Some readings are invalid. Please correct highlighted fields.");
        setLoading(false);
        return;
      }

      const docRef = doc(db, "engineReadings", entryDate);

      // ✅ Use updateDoc if doc exists, else setDoc
      const existingDoc = await getDoc(docRef);
      if (existingDoc.exists()) {
        await updateDoc(docRef, {
          readings,
          generation,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setDoc(docRef, {
          date: entryDate,
          readings,
          generation,
          createdBy: {
            name: currentUser?.name,
            email: currentUser?.email,
            department: currentUser?.department,
            empNumber: currentUser?.empNumber,
          },
          createdAt: new Date().toISOString(),
        });
      }

      alert("Readings saved successfully!");
      setLoading(false);

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

      // ✅ Avoid duplicate Firestore calls by checking cache
      if (cacheRef.current[yesterdayKey]) {
        setPreviousReadings(cacheRef.current[yesterdayKey]);
        return;
      }

      const yesterdayDoc = await getDoc(
        doc(db, "engineReadings", yesterdayKey),
      );
      if (yesterdayDoc.exists()) {
        const data = yesterdayDoc.data().readings || [];
        cacheRef.current[yesterdayKey] = data;
        setPreviousReadings(data);
      }
    };

    fetchPrevious();
  }, [entryDate]);

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
              onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
            <button type="submit" className="btn-primary" disabled={Loading}>
              {Loading ? "Saving..." : "Submit Readings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineReadingsEntry;
