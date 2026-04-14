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

  const [errors, setErrors] = useState(
    Array(5)
      .fill(null)
      .map(() => ({
        hfoKg: false,
        hfoLtr: false,
        lfoKg: false,
        lfoLtr: false,
        gasNm3: false,
        gasKg: false,
      })),
  );

  const DAILY_LIMITS = {
    hfoKg: 50000,
    hfoLtr: 50000,
    lfoKg: 50000,
    lfoLtr: 50000,
    gasNm3: 50000,
    gasKg: 50000,
  };

  useEffect(() => {
    const fetchYesterday = async () => {
      try {
        const yesterdayDate = new Date(entryDate);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

        const yesterdayDoc = await getDoc(
          doc(db, "fuelReadings", yesterdayKey),
        );

        if (yesterdayDoc.exists()) {
          setYesterdayData(yesterdayDoc.data().fuelReadings || []);
        } else {
          setYesterdayData([]);
        }
      } catch (error) {
        console.error("Error fetching yesterday data:", error);
        setYesterdayData([]);
      }
    };

    fetchYesterday();
  }, [entryDate]);

  const handleFuelChange = (index, field, value) => {
    const newFuelReadings = [...fuelReadings];
    newFuelReadings[index] = {
      ...newFuelReadings[index],
      [field]: value === "" ? "" : Number(value),
    };
    setFuelReadings(newFuelReadings);

    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [field]: false };
    setErrors(newErrors);
  };

  const hasAnyValue = (engine) => {
    return (
      engine.hfoKg !== "" ||
      engine.hfoLtr !== "" ||
      engine.lfoKg !== "" ||
      engine.lfoLtr !== "" ||
      engine.gasNm3 !== "" ||
      engine.gasKg !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let hasError = false;

      const newErrors = Array(5)
        .fill(null)
        .map(() => ({
          hfoKg: false,
          hfoLtr: false,
          lfoKg: false,
          lfoLtr: false,
          gasNm3: false,
          gasKg: false,
        }));

      const consumption = fuelReadings.map((engine, index) => {
        const yesterdayEngine = yesterdayData[index] || {
          hfoKg: 0,
          hfoLtr: 0,
          lfoKg: 0,
          lfoLtr: 0,
          gasNm3: 0,
          gasKg: 0,
        };

        if (!hasAnyValue(engine)) {
          newErrors[index].hfoKg = true;
          newErrors[index].hfoLtr = true;
          newErrors[index].lfoKg = true;
          newErrors[index].lfoLtr = true;
          if (index >= 3) {
            newErrors[index].gasNm3 = true;
            newErrors[index].gasKg = true;
          }
          hasError = true;
        }

        const currentHfoKg = Number(engine.hfoKg || 0);
        const currentHfoLtr = Number(engine.hfoLtr || 0);
        const currentLfoKg = Number(engine.lfoKg || 0);
        const currentLfoLtr = Number(engine.lfoLtr || 0);
        const currentGasNm3 = Number(engine.gasNm3 || 0);
        const currentGasKg = Number(engine.gasKg || 0);

        const prevHfoKg = Number(yesterdayEngine.hfoKg || 0);
        const prevHfoLtr = Number(yesterdayEngine.hfoLtr || 0);
        const prevLfoKg = Number(yesterdayEngine.lfoKg || 0);
        const prevLfoLtr = Number(yesterdayEngine.lfoLtr || 0);
        const prevGasNm3 = Number(yesterdayEngine.gasNm3 || 0);
        const prevGasKg = Number(yesterdayEngine.gasKg || 0);

        const diffHfoKg = currentHfoKg - prevHfoKg;
        const diffHfoLtr = currentHfoLtr - prevHfoLtr;
        const diffLfoKg = currentLfoKg - prevLfoKg;
        const diffLfoLtr = currentLfoLtr - prevLfoLtr;
        const diffGasNm3 = currentGasNm3 - prevGasNm3;
        const diffGasKg = currentGasKg - prevGasKg;

        if (diffHfoKg < 0 || diffHfoKg > DAILY_LIMITS.hfoKg) {
          newErrors[index].hfoKg = true;
          hasError = true;
        }
        if (diffHfoLtr < 0 || diffHfoLtr > DAILY_LIMITS.hfoLtr) {
          newErrors[index].hfoLtr = true;
          hasError = true;
        }
        if (diffLfoKg < 0 || diffLfoKg > DAILY_LIMITS.lfoKg) {
          newErrors[index].lfoKg = true;
          hasError = true;
        }
        if (diffLfoLtr < 0 || diffLfoLtr > DAILY_LIMITS.lfoLtr) {
          newErrors[index].lfoLtr = true;
          hasError = true;
        }
        if (diffGasNm3 < 0 || diffGasNm3 > DAILY_LIMITS.gasNm3) {
          newErrors[index].gasNm3 = true;
          hasError = true;
        }
        if (diffGasKg < 0 || diffGasKg > DAILY_LIMITS.gasKg) {
          newErrors[index].gasKg = true;
          hasError = true;
        }

        if (index < 3 && (currentGasNm3 > 0 || currentGasKg > 0)) {
          newErrors[index].gasNm3 = true;
          newErrors[index].gasKg = true;
          hasError = true;
        }

        if (index >= 3) {
          const gasNm3Entered = engine.gasNm3 !== "";
          const gasKgEntered = engine.gasKg !== "";

          if (gasNm3Entered !== gasKgEntered) {
            newErrors[index].gasNm3 = true;
            newErrors[index].gasKg = true;
            hasError = true;
          }
        }

        let capacity = 9780;
        if (index >= 3) {
          capacity = diffGasNm3 > 200 || diffGasKg > 200 ? 8997 : 9766;
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

      setErrors(newErrors);

      if (hasError) {
        alert("Some readings are invalid. Please correct highlighted fields.");
        return;
      }

      await setDoc(doc(db, "fuelReadings", entryDate), {
        date: entryDate,
        fuelReadings,
        consumption,
        createdBy: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          department: currentUser?.department || "",
          empNumber: currentUser?.empNumber || "",
        },
        updatedAt: new Date(),
      });

      alert("Fuel readings saved successfully!");
    } catch (error) {
      console.error("Error saving fuel readings:", error);
      alert("Error saving fuel readings: " + error.message);
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

          {fuelReadings.map((engine, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Engine {index + 1}</h3>

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
                  onWheel={(e) => e.target.blur()}
                  className="form-input"
                  style={
                    errors[index].hfoKg
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
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
                  onWheel={(e) => e.target.blur()}
                  className="form-input"
                  style={
                    errors[index].hfoLtr
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
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
                  onWheel={(e) => e.target.blur()}
                  className="form-input"
                  style={
                    errors[index].lfoLtr
                      ? { borderColor: "red", borderWidth: "2px" }
                      : {}
                  }
                />
              </div>

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
                      onWheel={(e) => e.target.blur()}
                      className="form-input"
                      style={
                        errors[index].gasNm3
                          ? { borderColor: "red", borderWidth: "2px" }
                          : {}
                      }
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
                      onWheel={(e) => e.target.blur()}
                      className="form-input"
                      style={
                        errors[index].gasKg
                          ? { borderColor: "red", borderWidth: "2px" }
                          : {}
                      }
                    />
                  </div>
                </>
              )}
            </div>
          ))}

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
