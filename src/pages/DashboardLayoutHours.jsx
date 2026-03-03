import React from "react";
import RealTimeStatus from "../components/Daily Readings/Egnien Start  Stop/RealTimeStatus";
import EnginePerformance from "../components/Daily Readings/Egnien Start  Stop/EnginePerformance";
import PerformanceDashboard from "../components/Daily Readings/Egnien Start  Stop/PerformanceDashboard";
import StoppageReports from "../components/Daily Readings/Egnien Start  Stop/StoppageReports";

export default function DashboardLayout() {
  return (
    <div className="container space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RealTimeStatus />
        <EnginePerformance />
        <StoppageReports />
        <PerformanceDashboard />
      </div>
    </div>
  );
}
