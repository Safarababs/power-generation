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
    <form onSubmit={handleSubmit}>
      <label>Operator Name:</label>
      <input
        type="text"
        value={operatorName}
        onChange={(e) => setOperatorName(e.target.value)}
        required
      />

      <label>Reading Date:</label>
      <input
        type="date"
        value={entryDate}
        onChange={(e) => setEntryDate(e.target.value)}
        required
      />

      <label>Engine Number:</label>
      <input
        type="number"
        value={engine}
        onChange={(e) => setEngine(Number(e.target.value))}
        required
      />

      <p>
        <strong>Detected Fuel Mode:</strong> {fuelMode || "Loading..."}
      </p>

      <label>Total Running Hours:</label>
      <input
        type="number"
        value={totalHours}
        onChange={(e) => setTotalHours(e.target.value)}
        required
      />

      <label>HFO Hours (optional):</label>
      <input
        type="number"
        value={hfoHours}
        onChange={(e) => setHfoHours(e.target.value)}
      />

      <label>Gas Hours (optional for DF engines):</label>
      <input
        type="number"
        value={gasHours}
        onChange={(e) => setGasHours(e.target.value)}
      />

      <button type="submit">Submit Wash Log</button>
    </form>
  );
};

export default WashLogForm;
