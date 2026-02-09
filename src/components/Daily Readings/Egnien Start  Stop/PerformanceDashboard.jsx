import React from "react";
import RunningHoursChart from "./RunningHoursChart";
import AvailabilityChart from "./AvailabilityChart";

export default function PerformanceDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Plant Performance Dashboard</h2>
      <RunningHoursChart />
      <AvailabilityChart />
    </div>
  );
}
