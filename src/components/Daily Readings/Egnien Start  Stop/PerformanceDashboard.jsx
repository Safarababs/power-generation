import React from "react";
import RunningHoursChart from "./RunningHoursChart";
import AvailabilityChart from "./AvailabilityChart";

export default function PerformanceDashboard() {
  return (
    <div>
      <RunningHoursChart />
      <div className="card-header">
        <h2 className="card-title">Plant Performance Dashboard</h2>
      </div>

      <AvailabilityChart />
    </div>
  );
}
