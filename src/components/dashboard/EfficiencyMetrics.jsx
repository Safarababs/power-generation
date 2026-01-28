import React, { useEffect, useState } from "react";
import { FaTachometerAlt, FaChartBar, FaThermometerHalf } from "react-icons/fa";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const EfficiencyMetrics = () => {
  const [engineReadings, setEngineReadings] = useState([]);
  const [fuelReadings, setFuelReadings] = useState([]);

  useEffect(() => {
    const qEngine = query(
      collection(db, "engineReadings"),
      orderBy("date", "desc"),
    );
    const unsubscribeEngine = onSnapshot(qEngine, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        generation: doc.data().generation || [],
        date: doc.data().date,
      }));
      setEngineReadings(docs);
    });

    const qFuel = query(
      collection(db, "fuelReadings"),
      orderBy("date", "desc"),
    );
    const unsubscribeFuel = onSnapshot(qFuel, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        consumption: doc.data().consumption || [],
        date: doc.data().date,
      }));
      setFuelReadings(docs);
    });

    return () => {
      unsubscribeEngine();
      unsubscribeFuel();
    };
  }, []);

  // ✅ Latest data
  const latestEngineData = engineReadings[0]?.generation || [];
  const latestFuelData = fuelReadings[0]?.consumption || [];

  // ✅ Total kWh generated
  const totalKWH = latestEngineData.reduce((sum, g) => sum + g.kwh, 0);

  // ✅ Fuel consumption breakdown
  const totalHFO = latestFuelData.reduce((sum, f) => sum + (f.hfo || 0), 0);
  const totalLFO = latestFuelData.reduce((sum, f) => sum + (f.lfo || 0), 0);
  const totalGas = latestFuelData.reduce((sum, f) => sum + (f.gas || 0), 0);
  const totalFuel = totalHFO + totalLFO + totalGas;

  // ✅ Capacity (average across engines)
  const totalCapacity = latestFuelData.reduce(
    (sum, f) => sum + (f.capacity || 9780),
    0,
  );

  // ✅ Overall efficiency (%)
  const maxPossible = totalCapacity * 24; // kWh possible in 24h
  const overallEfficiency =
    maxPossible > 0 ? (totalKWH / maxPossible) * 100 : 0;

  // ✅ Heat Rate (BTU/kWh)
  // Assume: 1 kg HFO ≈ 42,700 kJ, 1 kg LFO ≈ 43,000 kJ, 1 m³ Gas ≈ 35,000 kJ
  // Convert kJ → BTU (1 kJ ≈ 0.9478 BTU)
  const fuelEnergyBTU =
    totalHFO * 42700 * 0.9478 +
    totalLFO * 43000 * 0.9478 +
    totalGas * 35000 * 0.9478;

  const heatRate = totalKWH > 0 ? fuelEnergyBTU / totalKWH : 0;

  return (
    <div className="card h-full">
      <div className="card-header">
        <h2 className="card-title">Efficiency Metrics</h2>
      </div>

      <div className="card-content space-y-6">
        {/* Overall Efficiency */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaTachometerAlt
                size={18}
                style={{ color: "#3b82f6", marginRight: "0.5rem" }}
              />
              <span className="text-sm font-medium">Overall Efficiency</span>
            </div>
            <span className="text-lg font-bold">
              {overallEfficiency.toFixed(2)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallEfficiency.toFixed(2)}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-secondary">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Fuel Consumption Breakdown */}
        <div>
          <div className="flex items-center mb-2">
            <FaChartBar
              size={18}
              style={{ color: "#10b981", marginRight: "0.5rem" }}
            />
            <span className="text-sm font-medium">Fuel Consumption Rate</span>
          </div>
          <div className="space-y-4">
            {/* HFO */}
            <div>
              <p>HFO: {totalHFO} Kg</p>
              <div className="progress-bar" style={{ height: "12px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(totalHFO / totalFuel) * 100}%`,
                    backgroundColor: "#8b0000",
                    height: "100%",
                  }}
                ></div>
              </div>
            </div>

            {/* LFO */}
            <div>
              <p>LFO: {totalLFO} Kg</p>
              <div className="progress-bar" style={{ height: "12px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(totalLFO / totalFuel) * 100}%`,
                    backgroundColor: "#03500d",
                    height: "100%",
                  }}
                ></div>
              </div>
            </div>

            {/* Gas */}
            <div>
              <p>Gas: {totalGas} NM³</p>
              <div className="progress-bar" style={{ height: "12px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(totalGas / totalFuel) * 100}%`,
                    backgroundColor: "#ffd700",
                    height: "100%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Heat Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaThermometerHalf
                size={18}
                style={{ color: "#f50b0b", marginRight: "0.5rem" }}
              />
              <span className="text-sm font-medium">Heat Rate</span>
            </div>
            <span className="text-lg font-bold">
              {heatRate.toFixed(0)} BTU/kWh
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                backgroundColor: "#f50b0b",
                width: `${(heatRate / 12000) * 100}%`,
              }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-secondary">
            <span>8,000</span>
            <span>10,000</span>
            <span>12,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMetrics;
