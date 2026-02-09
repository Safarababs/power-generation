import React from "react";
import RealTimeStatus from "../components/Daily Readings/Egnien Start  Stop/RealTimeStatus";
import EnginePerformance from "../components/Daily Readings/Egnien Start  Stop/EnginePerformance";
import PerformanceDashboard from "../components/Daily Readings/Egnien Start  Stop/PerformanceDashboard";
import StoppageReports from "../components/Daily Readings/Egnien Start  Stop/StoppageReports";

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr 1fr",
        gap: "20px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Row: Real-Time Engine Status Tiles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <RealTimeStatus />
      </div>

      {/* Middle Row: Performance Table + Stoppage Reports */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "400px" }}>
          <EnginePerformance />
        </div>
        <div style={{ flex: 1, minWidth: "400px" }}>
          <StoppageReports />
        </div>
      </div>

      {/* Bottom Row: Graph Charts + Log Form */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "400px" }}>
          <PerformanceDashboard />
        </div>
      </div>
    </div>
  );
}
