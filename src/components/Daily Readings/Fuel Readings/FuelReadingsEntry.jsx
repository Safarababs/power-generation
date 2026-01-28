import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const FuelReadingsEntry = () => {
  const todayDefault = new Date().toISOString().split("T")[0];
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [operatorName, setOperatorName] = useState("");
  const [fuelReadings, setFuelReadings] = useState(
    Array(5).fill({ hfo: "", lfo: "", gas: "" }),
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
      [field]: Number(value),
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
          hfo: 0,
          lfo: 0,
          gas: 0,
        };
        const diffHfo = engine.hfo - yesterdayEngine.hfo;
        const diffLfo = engine.lfo - yesterdayEngine.lfo;
        const diffGas = engine.gas - yesterdayEngine.gas;

        // Capacity logic
        let capacity = 9780;
        if (index >= 3) {
          // Engines 4 & 5 are DF
          capacity = diffGas > 0 ? 8998 : 9780;
        }

        return { hfo: diffHfo, lfo: diffLfo, gas: diffGas, capacity };
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
      setFuelReadings(Array(5).fill({ hfo: "", lfo: "", gas: "" }));
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
                  HFO Reading
                </label>
                <input
                  type="number"
                  value={engine.hfo}
                  placeholder={
                    yesterdayData[index]?.hfo
                      ? yesterdayData[index].hfo
                      : "Enter HFO"
                  }
                  onChange={(e) =>
                    handleFuelChange(index, "hfo", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* LFO */}
              <div className="mb-4">
                <label className="text-secondary font-medium mb-2 block">
                  LFO Reading
                </label>
                <input
                  type="number"
                  value={engine.lfo}
                  placeholder={
                    yesterdayData[index]?.lfo
                      ? yesterdayData[index].lfo
                      : "Enter LFO"
                  }
                  onChange={(e) =>
                    handleFuelChange(index, "lfo", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Gas (only for engines 4 & 5) */}
              {index >= 3 && (
                <div>
                  <label className="text-secondary font-medium mb-2 block">
                    Gas Reading
                  </label>
                  <input
                    type="number"
                    value={engine.gas}
                    placeholder={
                      yesterdayData[index]?.gas
                        ? yesterdayData[index].gas
                        : "Enter Gas"
                    }
                    onChange={(e) =>
                      handleFuelChange(index, "gas", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
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
