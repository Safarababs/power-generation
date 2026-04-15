import React from "react";
import "./dashboardPlaceholder.css";

function ElectricalDashboard() {
  return (
    <div className="ph-page ph-electrical">
      <div className="ph-hero-card">
        <div className="ph-badge">Under Development</div>
        <h1 className="ph-title">Electrical Dashboard</h1>
        <p className="ph-subtitle">
          This module is being prepared to provide visibility of electrical
          system health, performance, alarms, and operational availability.
        </p>
      </div>

      <div className="ph-grid">
        <div className="ph-card">
          <h3>Planned Coverage</h3>
          <ul>
            <li>Electrical equipment status overview</li>
            <li>Fault and trip monitoring</li>
            <li>Load and availability analysis</li>
            <li>Preventive maintenance indicators</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Expected KPIs</h3>
          <ul>
            <li>Running assets</li>
            <li>Faulted equipment</li>
            <li>Available feeders</li>
            <li>Maintenance status</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Current Status</h3>
          <p>
            Dashboard design is in progress. Data structure and KPI presentation
            will be added in the upcoming version.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ElectricalDashboard;
