import React from "react";
import "./dashboardPlaceholder.css";

function UtilityDashboard() {
  return (
    <div className="ph-page ph-utility">
      <div className="ph-hero-card">
        <div className="ph-badge">Under Development</div>
        <h1 className="ph-title">Utility Dashboard</h1>
        <p className="ph-subtitle">
          This module will provide utility system monitoring, availability
          review, and high-level visibility of utility operations across the
          plant.
        </p>
      </div>

      <div className="ph-grid">
        <div className="ph-card">
          <h3>Planned Coverage</h3>
          <ul>
            <li>Utility equipment and service monitoring</li>
            <li>Availability and downtime visibility</li>
            <li>Operational utility performance</li>
            <li>Maintenance and exception tracking</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Expected KPIs</h3>
          <ul>
            <li>Utility systems online</li>
            <li>Warning conditions</li>
            <li>Under-maintenance utilities</li>
            <li>Operational exceptions</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Current Status</h3>
          <p>
            Utility dashboard is under development. Full operational metrics and
            analytics will be introduced in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UtilityDashboard;
