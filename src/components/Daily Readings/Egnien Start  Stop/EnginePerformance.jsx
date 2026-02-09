import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import {
  calculateRunningHours,
  calculateAvailability,
} from "./Utils/calculateMetrics";

export default function EnginePerformance() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("monthly");

  const periodHoursMap = {
    daily: 24,
    weekly: 24 * 7,
    monthly: 24 * 30,
    yearly: 24 * 365,
    all: 24 * 365,
  };

  const engines = ["E1", "E2", "E3", "E4", "E5"];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const snap = await getDocs(collection(db, "engineLogs"));
    const data = snap.docs.map((d) => ({
      ...d.data(),
      eventDateTime: d.data().eventDateTime.toDate(),
    }));
    setLogs(data);
  };

  const filterLogs = () => {
    const now = new Date();
    return logs.filter((log) => {
      const d = log.eventDateTime;
      if (filter === "daily") return d.toDateString() === now.toDateString();
      if (filter === "weekly") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (filter === "monthly")
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      if (filter === "yearly") return d.getFullYear() === now.getFullYear();
      return true;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Engine Running Hours & Availability</h2>

      {["daily", "weekly", "monthly", "yearly", "all"].map((f) => (
        <button key={f} onClick={() => setFilter(f)}>
          {f.toUpperCase()}
        </button>
      ))}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Engine</th>
            <th>Running Hours</th>
            <th>Availability %</th>
          </tr>
        </thead>
        <tbody>
          {engines.map((engine) => {
            const engineLogs = filterLogs().filter(
              (l) => l.engineId === engine,
            );
            const runningHours = calculateRunningHours(engineLogs);
            const availability = calculateAvailability(
              runningHours,
              periodHoursMap[filter],
            );

            return (
              <tr key={engine}>
                <td>{engine}</td>
                <td>{runningHours.toFixed(2)} hrs</td>
                <td>{availability}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
