import React from "react";
import "./dashboardPlaceholder.css";

function MechanicalDashboard() {
  return (
    <div className="ph-page ph-mechanical">
      <div className="ph-hero-card">
        <div className="ph-badge">Under Development</div>
        <h1 className="ph-title">Mechanical Dashboard</h1>
        <p className="ph-subtitle">
          This module will present a consolidated view of mechanical systems,
          equipment condition, maintenance insights, and operational readiness.
        </p>
      </div>

      <div className="ph-grid">
        <div className="ph-card">
          <h3>Planned Coverage</h3>
          <ul>
            <li>Mechanical equipment condition monitoring</li>
            <li>Maintenance tracking and equipment readiness</li>
            <li>Operational status of key assets</li>
            <li>Issue and breakdown visibility</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Expected KPIs</h3>
          <ul>
            <li>Operational equipment count</li>
            <li>Warning and attention items</li>
            <li>Maintenance load</li>
            <li>Critical mechanical alerts</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Current Status</h3>
          <p>
            Mechanical dashboard is currently being structured. KPI logic,
            tables, and visual reporting will be added soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MechanicalDashboard;
