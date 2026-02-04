import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const FuelReadingsEntry = () => {
  const todayDefault = new Date().toISOString().split("T")[0];
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [operatorName, setOperatorName] = useState("");
  const [fuelReadings, setFuelReadings] = useState(
    Array(5).fill({
      hfoKg: "",
      hfoLtr: "",
      lfoKg: "",
      lfoLtr: "",
      gasNm3: "",
      gasKg: "",
    }),
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
        let capacity = 9780;
        if (index >= 3) {
          // Engines 4 & 5 are DF
          capacity = diffGasNm3 > 0 || diffGasKg > 0 ? 8998 : 9780;
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
        operatorName,
        date: entryDate,
        fuelReadings,
        consumption,
      });

      alert("Fuel readings saved successfully!");

      // Reset form
      setOperatorName("");
      setEntryDate(todayDefault);
      setFuelReadings(
        Array(5).fill({
          hfoKg: "",
          hfoLtr: "",
          lfoKg: "",
          lfoLtr: "",
          gasNm3: "",
          gasKg: "",
        }),
      );
    } catch (error) {
      console.error("Error saving fuel readings: ", error);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-6">Fuel Readings Entry</h2>
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
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* LFO */}
              <div className="mb-4">
                <label className="text-secondary font-medium mb-2 block">
                  LFO Reading (Kg)
                </label>
                <input
                  type="number"
                  value={engine.lfoKg}
                  placeholder={yesterdayData[index]?.lfoKg || "Enter LFO Kg"}
                  onChange={(e) =>
                    handleFuelChange(index, "lfoKg", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
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
                  className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Submit */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Submit Fuel Readings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelReadingsEntry;
