import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const FuelReadingsEntry = ({ currentUser }) => {
  const todayDefault = new Date().toISOString().split("T")[0];
  const [entryDate, setEntryDate] = useState(todayDefault);

  const [fuelReadings, setFuelReadings] = useState(
    Array(5)
      .fill(null)
      .map(() => ({
        hfoKg: "",
        hfoLtr: "",
        lfoKg: "",
        lfoLtr: "",
        gasNm3: "",
        gasKg: "",
      })),
  );
  const [yesterdayData, setYesterdayData] = useState([]);
  // Fetch yesterday’s readings for placeholders
  useEffect(() => {
    const fetchYesterday = async () => {
      const yesterdayDate = new Date(entryDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = yesterdayDate.toISOString().split("T")[0];
      const yesterdayDoc = await getDoc(doc(db, "fuelReadings", yesterdayKey));
      if (yesterdayDoc.exists()) {
        setYesterdayData(yesterdayDoc.data().fuelReadings || []);
      } else {
        setYesterdayData([]);
      }
    };
    fetchYesterday();
  }, [entryDate]);
  // Handle input change
  const handleFuelChange = (index, field, value) => {
    const newFuelReadings = [...fuelReadings];
    newFuelReadings[index] = {
      ...newFuelReadings[index],
      [field]: value === "" ? "" : Number(value),
    };
    setFuelReadings(newFuelReadings);
  };
  // Submit readings
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate consumption + capacity
      const consumption = fuelReadings.map((engine, index) => {
        const yesterdayEngine = yesterdayData[index] || {
          hfoKg: 0,
          hfoLtr: 0,
          lfoKg: 0,
          lfoLtr: 0,
          gasNm3: 0,
          gasKg: 0,
        };

        const diffHfoKg = (engine.hfoKg || 0) - (yesterdayEngine.hfoKg || 0);
        const diffHfoLtr = (engine.hfoLtr || 0) - (yesterdayEngine.hfoLtr || 0);
        const diffLfoKg = (engine.lfoKg || 0) - (yesterdayEngine.lfoKg || 0);
        const diffLfoLtr = (engine.lfoLtr || 0) - (yesterdayEngine.lfoLtr || 0);
        const diffGasNm3 = (engine.gasNm3 || 0) - (yesterdayEngine.gasNm3 || 0);
        const diffGasKg = (engine.gasKg || 0) - (yesterdayEngine.gasKg || 0);

        // Capacity logic
        let capacity = 9700; // Default for engines 1-3
        if (index >= 3) {
          // Engines 4 & 5 are DF
          capacity = diffGasNm3 > 0 || diffGasKg > 0 ? 8900 : 9700;
        }

        return {
          hfoKg: diffHfoKg,
          hfoLtr: diffHfoLtr,
          lfoKg: diffLfoKg,
          lfoLtr: diffLfoLtr,
          gasNm3: diffGasNm3,
          gasKg: diffGasKg,
          capacity,
        };
      });

      // Save to Firestore
      await setDoc(doc(db, "fuelReadings", entryDate), {
        date: entryDate,
        fuelReadings,
        consumption,
        createdBy: {
          name: currentUser?.name, // "Safar Abbas"
          email: currentUser?.email, // "safarabbas73.sa@gmail.com"
          department: currentUser?.department, // "developer"
          empNumber: currentUser?.empNumber, // "058"
        },
      });

      alert("Fuel readings saved successfully!");

      // Reset form

      setEntryDate(todayDefault);
      setFuelReadings(
        Array(5)
          .fill(null)
          .map(() => ({
            hfoKg: "",
            hfoLtr: "",
            lfoKg: "",
            lfoLtr: "",
            gasNm3: "",
            gasKg: "",
          })),
      );
    } catch (error) {
      console.log("Error: ", error);
      alert("Error saving fuel readings: ", error);
    }
  };
  return (
    <div className="card">
      {" "}
      <div className="card-content">
        {" "}
        <h2 className="card-title mb-6">Fuel Readings Entry</h2>{" "}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {" "}
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
          {fuelReadings.map((engine, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Engine {index + 1}</h3>

              {/* HFO */}
              <div className="mb-4">
                <label className="text-secondary font-medium mb-2 block">
                  HFO Reading (Kg)
                </label>
                <input
                  type="number"
                  value={engine.hfoKg}
                  placeholder={yesterdayData[index]?.hfoKg || "Enter HFO Kg"}
                  onChange={(e) =>
                    handleFuelChange(index, "hfoKg", e.target.value)
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-secondary font-medium mb-2 block">
                  HFO Reading (Liters)
                </label>
                <input
                  type="number"
                  value={engine.hfoLtr}
                  placeholder={yesterdayData[index]?.hfoLtr || "Enter HFO Ltr"}
                  onChange={(e) =>
                    handleFuelChange(index, "hfoLtr", e.target.value)
                  }
                  className="form-input"
                />
              </div>

              {/* LFO */}

              <div className="mb-4">
                <label className="text-secondary font-medium mb-2 block">
                  LFO Reading (Liters)
                </label>
                <input
                  type="number"
                  value={engine.lfoLtr}
                  placeholder={yesterdayData[index]?.lfoLtr || "Enter LFO Ltr"}
                  onChange={(e) =>
                    handleFuelChange(index, "lfoLtr", e.target.value)
                  }
                  className="form-input"
                />
              </div>

              {/* Gas (only for engines 4 & 5) */}
              {index >= 3 && (
                <>
                  <div className="mb-4">
                    <label className="text-secondary font-medium mb-2 block">
                      Gas Reading (Nm³)
                    </label>
                    <input
                      type="number"
                      value={engine.gasNm3}
                      placeholder={
                        yesterdayData[index]?.gasNm3 || "Enter Gas Nm³"
                      }
                      onChange={(e) =>
                        handleFuelChange(index, "gasNm3", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-secondary font-medium mb-2 block">
                      Gas Reading (Kg)
                    </label>
                    <input
                      type="number"
                      value={engine.gasKg}
                      placeholder={
                        yesterdayData[index]?.gasKg || "Enter Gas Kg"
                      }
                      onChange={(e) =>
                        handleFuelChange(index, "gasKg", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          {/* Submit */}
          <div className="col-span-full flex justify-end mt-4">
            <button type="submit" className="btn-primary">
              Submit Fuel Readings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FuelReadingsEntry;
