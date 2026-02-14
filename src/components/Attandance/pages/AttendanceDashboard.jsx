import React, { useEffect, useState } from "react";
import { fetchAttendanceRecords } from "../services/dashboardService";

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAttendanceRecords();
      setRecords(data);
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Attendance Dashboard</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Shift</th>
            <th>Status</th>
            <th>Device ID</th>
            <th>Platform</th>
            <th>Network IP</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.employeeId}</td>
              <td>{r.shift}</td>
              <td>{r.status}</td>
              <td>{r.deviceId}</td>
              <td>{r.platform}</td>
              <td>{r.networkIP}</td>
              <td>{r.latitude}</td>
              <td>{r.longitude}</td>
              <td>{new Date(r.timestamp.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDashboard;
