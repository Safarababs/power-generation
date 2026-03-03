import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

export default function StoppageReports() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("daily");

  const fetchLogs = async () => {
    const snap = await getDocs(collection(db, "engineLogs"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      eventDateTime: d.data().eventDateTime.toDate(),
    }));

    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const now = new Date();

  const filteredLogs = logs.filter((log) => {
    const date = log.eventDateTime;

    if (filter === "daily") return date.toDateString() === now.toDateString();
    if (filter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }
    if (filter === "monthly")
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    if (filter === "yearly") return date.getFullYear() === now.getFullYear();

    return true; // all time
  });

  const stoppages = filteredLogs.filter((l) => l.eventType === "stop").length;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Engine Stoppage Reports</h2>
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
          <div className="card-header">
            <h2 className="card-title">Total Stoppages: {stoppages}</h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Engine</th>
                <th>Event</th>
                <th>Date Time</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.engineId}</td>
                  <td>{log.eventType}</td>
                  <td>{log.eventDateTime.toLocaleString()}</td>
                  <td>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
