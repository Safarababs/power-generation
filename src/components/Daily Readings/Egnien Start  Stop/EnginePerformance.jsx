import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { calculateRunningHours } from "./Utils/calculateMetrics";
const engines = ["E1", "E2", "E3", "E4", "E5"];
export default function EnginePerformance() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("monthly");
  const [latestReadings, setLatestReadings] = useState({});
  const [engineStatus, setEngineStatus] = useState({});

  const periodHoursMap = {
    daily: 24,
    weekly: 24 * 7,
    monthly: 24 * 30,
    yearly: 24 * 365,
    all: 24 * 365,
  };

  // Fetch latest cumulative readings (previous day up to 6AM)
  const fetchLatestReadings = useCallback(async () => {
    const q = query(
      collection(db, "engineReadings"),
      orderBy("date", "desc"),
      limit(1),
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0].data();
      const readings = {};
      engines.forEach((engine, idx) => {
        readings[engine] = {
          rhrs: doc.readings[idx]?.rhrs || 0,
          date: doc.date,
        };
      });
      setLatestReadings(readings);
    }
  }, []);

  // Fetch engine status (current state + last event)
  const fetchEngineStatus = useCallback(async () => {
    const snap = await getDocs(collection(db, "engineStatus"));
    const statuses = {};
    snap.forEach((d) => {
      statuses[d.id] = {
        currentStatus: d.data().currentStatus,
        lastEventTime: d.data().lastEventTime?.toDate(),
        lastEventType: d.data().lastEventType,
      };
    });
    setEngineStatus(statuses);
  }, []);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    const snap = await getDocs(collection(db, "engineLogs"));
    const data = snap.docs.map((d) => ({
      ...d.data(),
      eventDateTime: d.data().eventDateTime.toDate(),
    }));
    setLogs(data);
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchLatestReadings();
    fetchEngineStatus();
  }, [fetchLogs, fetchLatestReadings, fetchEngineStatus]);

  // Count stops
  const calculateStops = (engineLogs) =>
    engineLogs.filter((l) => l.eventType === "stop").length;

  // Categorize stoppage hours by reason
  const calculateCategories = (engineLogs) => {
    const categories = { SB: 0, UM: 0, STOP: 0 };
    const sorted = [...engineLogs].sort(
      (a, b) => a.eventDateTime - b.eventDateTime,
    );
    let lastStart = null;

    sorted.forEach((log) => {
      if (log.eventType === "start") {
        lastStart = log.eventDateTime;
      } else if (log.eventType === "stop" && lastStart) {
        const diff = (log.eventDateTime - lastStart) / (1000 * 60 * 60);
        if (log.reason === "SB") categories.SB += diff;
        else if (log.reason === "U/M") categories.UM += diff;
        else categories.STOP += diff;
        lastStart = null;
      }
    });

    return categories;
  };

  // Calculate cumulative hours using readings + engineStatus
  const calculateCumulative = (engineId) => {
    const reading = latestReadings[engineId];
    const status = engineStatus[engineId];
    if (!reading || !status) return 0;

    let base = reading.rhrs;
    const cutoff = new Date(reading.date + " 06:00:00"); // start of current day
    const lastEvent = status.lastEventTime;

    if (lastEvent && lastEvent > cutoff) {
      const extra = (lastEvent - cutoff) / (1000 * 60 * 60);
      base += extra;
    }

    if (status.currentStatus === "running" && lastEvent) {
      const extra = (new Date() - lastEvent) / (1000 * 60 * 60);
      base += extra;
    }

    return base;
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
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Engine Performance Dashboard</h2>
      </div>
      <div className="card-content">
        <div className="overflow-x-auto">
          {["daily", "weekly", "monthly", "yearly", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn-primary btn-sm mr-2 mb-2"
            >
              {f.toUpperCase()}
            </button>
          ))}

          <table className="table">
            <thead>
              <tr>
                <th>Engine</th>
                <th>Cumulative Rhrs</th>
                <th>Running Hours</th>
                <th>Stoppage Hours</th>
                <th>No. of Stops</th>
                <th>SB Hours</th>
                <th>U/M Hours</th>
              </tr>
            </thead>
            <tbody>
              {engines.map((engine) => {
                const engineLogs = filterLogs().filter(
                  (l) => l.engineId === engine,
                );
                const runningHours = calculateRunningHours(engineLogs);
                const stops = calculateStops(engineLogs);
                const categories = calculateCategories(engineLogs);

                const cumulative = calculateCumulative(engine);
                const stoppageHours =
                  periodHoursMap[filter] - runningHours >= 0
                    ? periodHoursMap[filter] - runningHours
                    : 0;

                return (
                  <tr key={engine}>
                    <td>{engine}</td>
                    <td>{cumulative.toFixed(1)} hrs</td>
                    <td>{runningHours.toFixed(1)} hrs</td>
                    <td>{stoppageHours.toFixed(1)} hrs</td>
                    <td>{stops}</td>
                    <td>{categories.SB.toFixed(1)} hrs</td>
                    <td>{categories.UM.toFixed(1)} hrs</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
