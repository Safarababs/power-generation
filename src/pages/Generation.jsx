import React, { useState, useEffect } from "react";
import { FaBolt, FaPlay, FaPause, FaSync, FaCog } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../components/FIrestore/firebase";

const Generation = () => {
  const [selectedGenerator, setSelectedGenerator] = useState(null);
  const [engineReadings, setEngineReadings] = useState([]);
  const [fuelReadings, setFuelReadings] = useState([]);
  const [engines, setEngines] = useState([]);

  // lets track real-time engine status for the top tiles
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "engineStatus"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEngines(data);
    });

    return () => unsub();
  }, []);

  // Add a derived value that counts how many engines have currentStatus === "running":
  const runningGenerators = engines.filter(
    (engine) => engine.currentStatus === "running",
  ).length;

  // 🔧 Fetch Firestore data
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

  // 🔧 Helper: Get latest readings
  const latestEngineData = engineReadings[0]?.generation || [];
  const latestFuelData = fuelReadings[0]?.consumption || [];

  const totalKWh = latestEngineData.reduce((sum, e) => sum + e.kwh, 0);
  const totalCapacity = latestFuelData.reduce(
    (sum, f) => sum + (f.capacity || 9780),
    0,
  );
  const capacityUtilization =
    totalCapacity > 0 ? ((totalKWh / totalCapacity) * 100).toFixed(1) : 0;
  const maintenanceDue = latestFuelData.filter(
    (f) => parseInt(f.nextMaintenance) <= 7,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Power Generation Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-secondary">
            Total Output:{" "}
            <span className="font-semibold text-lg">
              {totalKWh.toFixed(1)} KWh
            </span>
          </div>
        </div>
      </div>

      {/* 🔧 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Active Generators</p>
                <p className="text-2xl font-bold">{runningGenerators}</p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaBolt size={24} style={{ color: "#10b981" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <FaArrowTrendUp
                size={16}
                style={{ color: "#10b981", marginRight: "0.25rem" }}
              />
              <span style={{ color: "#10b981" }}>Compared to yesterday</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Capacity Utilization</p>
                <p className="text-2xl font-bold">{capacityUtilization}%</p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <FaArrowTrendUp size={24} style={{ color: "#3b82f6" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <FaArrowTrendDown
                size={16}
                style={{ color: "#ef4444", marginRight: "0.25rem" }}
              />
              <span style={{ color: "#ef4444" }}>Change from last hour</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Maintenance Due</p>
                <p className="text-2xl font-bold">{maintenanceDue}</p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaSync size={24} style={{ color: "#f59e0b" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span style={{ color: "#f59e0b" }}>Within 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔧 Per-Engine Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {latestEngineData.map((engine, idx) => {
          const fuel = latestFuelData[idx] || {};
          const isRunning =
            engines.find((e) => e.engineId === `E${idx + 1}`)?.currentStatus ===
            "running";

          return (
            <div key={idx} className="card">
              <div className="card-content">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Engine {idx + 1}</h3>
                  <span
                    className={`status-badge ${isRunning ? "status-online" : "status-offline"}`}
                  >
                    {isRunning ? "Running" : "Stopped"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Output</span>
                    <span className="font-semibold">
                      {(
                        (engine.kwh / ((fuel.capacity || 9780) * 24)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (engine.kwh / ((fuel.capacity || 9780) * 24)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary">Running Hours</span>
                      <p className="font-semibold">{engine.rhrs.toFixed(1)}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Generation</span>
                      <p className="font-semibold">{engine.kwh} KWH</p>
                    </div>
                    <div>
                      <span className="text-secondary">Fuel Used</span>
                      <p className="font-semibold">
                        {(fuel.hfo || 0) + (fuel.lfo || 0) + (fuel.gas || 0)}{" "}
                        Total
                      </p>
                      <div className="text-xs text-secondary mt-1">
                        HFO: {fuel.hfo || 0} | LFO: {fuel.lfo || 0} | Gas:{" "}
                        {fuel.gas || 0}
                      </div>
                    </div>
                    <div>
                      <span className="text-secondary">Status</span>
                      <p
                        className={`font-semibold ${
                          engine.currentStatus === "running"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {engine.currentStatus === "running"
                          ? "Active"
                          : "Stopped"}
                      </p>
                      <div className="text-xs text-secondary mt-1">
                        Last {engine.lastEventType} at{" "}
                        {engine.lastEventTime?.toDate().toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    {isRunning ? (
                      <button className="flex-1 btn btn-danger">
                        <FaPause size={16} className="btn-icon" /> Stop
                      </button>
                    ) : (
                      <button className="flex-1 btn btn-success">
                        <FaPlay size={16} className="btn-icon" /> Start
                      </button>
                    )}

                    <button className="flex-1 btn btn-primary">
                      <FaSync size={16} className="btn-icon" /> Maintain
                    </button>

                    <button
                      onClick={() => setSelectedGenerator(idx)}
                      className="btn"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    >
                      <FaCog size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* 🔧 Selected Generator Details */}
      {selectedGenerator !== null && (
        <div className="card mt-6">
          <div className="card-content">
            <h3 className="text-lg font-semibold">
              Engine {selectedGenerator + 1} Settings
            </h3>
            <p className="text-secondary">
              Here you can show extra details or controls…
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generation;
