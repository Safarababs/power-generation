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
    <div style={{ padding: 20 }}>
      <h2>Stoppage Reports</h2>

      {["daily", "weekly", "monthly", "yearly", "all"].map((f) => (
        <button key={f} onClick={() => setFilter(f)}>
          {f.toUpperCase()}
        </button>
      ))}

      <h3>Total Stoppages: {stoppages}</h3>

      <table border="1" cellPadding="8">
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
  );
}
