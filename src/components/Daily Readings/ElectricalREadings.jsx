import React, { useState } from "react";
import { FaBolt, FaClock } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const ControlRoomReadings = () => {
  const [readings, setReadings] = useState(
    Array.from({ length: 5 }, () => ({ kwh: "", rhrs: "" }))
  );
  const [operatorName, setOperatorName] = useState("");

  const handleChange = (index, field, value) => {
    const newReadings = [...readings];
    newReadings[index][field] = value;
    setReadings(newReadings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Readings:", readings);

    try {
      // Add a new document with a generated ID to the "engineReadings" collection
      const docRef = await addDoc(collection(db, "engineReadings"), {
        operator: operatorName || "Safar Abbas",
        readings: readings, // array of 5 engines (kwh + rhrs)
        timestamp: serverTimestamp(), // ✅ one submission timestamp
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Readings submitted successfully!");
      setOperatorName("");
      setReadings(Array.from({ length: 5 }, () => ({ kwh: "", rhrs: "" })));
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting readings. Please try again.");
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
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          ))}

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

export default ControlRoomReadings;
