import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const WashLogForm = () => {
  const todayDefault = new Date().toISOString().split("T")[0];
  const [entryDate, setEntryDate] = useState(todayDefault);
  const [operatorName, setOperatorName] = useState("");
  const [engine, setEngine] = useState("");
  const [fuelMode, setFuelMode] = useState(""); // auto-detected
  const [totalHours, setTotalHours] = useState("");
  const [hfoHours, setHfoHours] = useState("");
  const [gasHours, setGasHours] = useState("");

  // Fetch fuel mode from today's fuelReadings doc
  useEffect(() => {
    const fetchFuelMode = async () => {
      try {
        const fuelDoc = await getDoc(doc(db, "fuelReadings", entryDate));
        if (fuelDoc.exists()) {
          const data = fuelDoc.data();
          const consumption = data.consumption || [];
          const engineIndex = engine ? Number(engine) - 1 : 0;
          const cap = consumption[engineIndex]?.capacity;

          if (cap === 8998) setFuelMode("GAS");
          else if (cap === 9780) setFuelMode("HFO/LFO");
        }
      } catch (err) {
        console.error("Error fetching fuel mode:", err);
      }
    };

    if (engine) fetchFuelMode();
  }, [entryDate, engine]);

  const calculateHours = () => {
    let lfo = null;
    let hfo = hfoHours ? Number(hfoHours) : null;
    let gas = gasHours ? Number(gasHours) : null;
    let total = Number(totalHours);

    if (engine <= 3) {
      if (hfo !== null) lfo = total - hfo;
    } else {
      if (hfo !== null) gas = total - hfo;
      else if (gas !== null) hfo = total - gas;
    }
    return { total, hfo, lfo, gas };
  };

  const getNextWashInterval = () => {
    if (engine <= 3) return { turbine: 100, compressor: 50 };
    if (engine >= 4) {
      return {
        turbine: fuelMode === "GAS" ? 200 : 72,
        compressor: 50,
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { total, hfo, lfo, gas } = calculateHours();
    const intervals = getNextWashInterval();

    await setDoc(doc(db, "washLogs", entryDate), {
      operatorName,
      date: entryDate,
      engine,
      fuelMode,
      totalHours: total,
      hfoHours: hfo,
      lfoHours: lfo,
      gasHours: gas,
      turbineInterval: intervals.turbine,
      compressorInterval: intervals.compressor,
      timestamp: new Date(),
    });

    alert("Wash log submitted!");
    setOperatorName("");
    setEngine("");
    setFuelMode("");
    setTotalHours("");
    setHfoHours("");
    setGasHours("");
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title mb-6">Engine Wash Log Entry</h2>
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
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <label className="text-secondary font-medium mb-2 block">
            Reading Date:
          </label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="form-input"
          />

          <label className="text-secondary font-medium mb-2 block">
            Engine Number:
          </label>
          <input
            type="number"
            value={engine}
            onChange={(e) => setEngine(Number(e.target.value))}
            required
            className="form-input"
          />
          {/* here we will add color logic of ternary operator if gas then yellow if hfo/lfo then red if loading tehn white  */}

          <p
            style={{
              color:
                fuelMode === "GAS"
                  ? "yellow"
                  : fuelMode === "HFO/LFO"
                    ? "red"
                    : "white",
            }}
          >
            <strong>Detected Fuel Mode:</strong> {fuelMode || "Loading..."}
          </p>

          <label className="text-secondary font-medium mb-2 block">
            Total Running Hours:
          </label>
          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            required
            className="form-input"
          />

          <label className="text-secondary font-medium mb-2 block">
            HFO Hours (optional):
          </label>
          <input
            type="number"
            value={hfoHours}
            onChange={(e) => setHfoHours(e.target.value)}
            className="form-input"
          />

          <label className="text-secondary font-medium mb-2 block">
            Gas Hours (optional for DF engines):
          </label>
          <input
            type="number"
            value={gasHours}
            onChange={(e) => setGasHours(e.target.value)}
            className="form-input"
          />

          <button type="submit" className="btn-primary">
            Submit Wash Log
          </button>
        </form>
      </div>
    </div>
  );
};

export default WashLogForm;
