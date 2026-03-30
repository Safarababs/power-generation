import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const engines = ["All Engines", "E1", "E2", "E3", "E4", "E5"];

export default function EngineLogTable() {
  const [logs, setLogs] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState("All Engines");
  const [selectedDate, setSelectedDate] = useState(""); // yyyy-mm-dd

  const fetchLogs = async () => {
    let q = query(
      collection(db, "engineLogs"),
      orderBy("eventDateTime", "desc"),
      limit(5),
    );
    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        engineId: d.engineId,
        eventType: d.eventType,
        eventDateTime: d.eventDateTime.toDate(), // ✅ convert Firestore Timestamp to JS Date
        reason: d.reason || "",
      };
    });

    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedEngine, selectedDate]);

  // Pair start/stop cycles
  const buildCycles = () => {
    const cycles = [];
    let currentCycle = null;

    logs
      .filter(
        (log) =>
          selectedEngine === "All Engines" || log.engineId === selectedEngine,
      )
      .forEach((log) => {
        if (log.eventType === "start") {
          currentCycle = {
            engineId: log.engineId,
            startTime: log.eventDateTime,
            stopTime: null,
            reason: "",
          };
        } else if (log.eventType === "stop" && currentCycle) {
          currentCycle.stopTime = log.eventDateTime;
          currentCycle.reason = log.reason;
          cycles.push(currentCycle);
          currentCycle = null;
        }
      });

    return cycles;
  };

  const cycles = buildCycles();

  // ✅ Updated uptime calculation
  const calculateUptime = (cycle) => {
    if (!cycle.startTime || !cycle.stopTime) return "—";

    const start = new Date(cycle.startTime);
    const stop = new Date(cycle.stopTime);

    const diffMs = start.getTime() - stop.getTime(); // always positive if stop is later
    if (diffMs < 0) return "—"; // guard against bad/mismatched data

    const diffHours = diffMs / (1000 * 60 * 60);
    return `${diffHours.toFixed(1)}h`; // e.g. "5.3h"
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="form-label">Select Engine:</label>
        <select
          value={selectedEngine}
          onChange={(e) => setSelectedEngine(e.target.value)}
          className="form-select"
        >
          {engines.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <label className="form-label">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-input input-date"
        />
      </div>

      {/* Table */}
      <div className="card w-full">
        <div className="card-header">
          <h3 className="card-title">
            {selectedEngine === "All Engines"
              ? "All Engine Cycles"
              : `Engine ${selectedEngine} Cycles`}
          </h3>
        </div>
        <div className="card-content overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Engine</th>
                <th>Start Time</th>
                <th>Stop Time</th>
                <th>Stoppage</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((cycle, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{cycle.engineId}</td>
                  <td>{cycle.startTime?.toLocaleString() || "—"}</td>
                  <td>{cycle.stopTime?.toLocaleString() || "—"}</td>
                  <td>{calculateUptime(cycle)}</td>
                  <td>{cycle.reason}</td>
                </tr>
              ))}
              {cycles.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-secondary">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
