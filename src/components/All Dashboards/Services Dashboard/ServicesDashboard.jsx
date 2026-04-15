import React from "react";
import "./dashboardPlaceholder.css";

function ServicesDashboard() {
  return (
    <div className="ph-page ph-services">
      <div className="ph-hero-card">
        <div className="ph-badge">Under Development</div>
        <h1 className="ph-title">Services Dashboard</h1>
        <p className="ph-subtitle">
          This dashboard will cover service systems, support operations, and
          utility-linked services required for stable plant functioning.
        </p>
      </div>

      <div className="ph-grid">
        <div className="ph-card">
          <h3>Planned Coverage</h3>
          <ul>
            <li>Support services operational view</li>
            <li>Service interruptions and observations</li>
            <li>Readiness and resource availability</li>
            <li>Monitoring of service-related exceptions</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Expected KPIs</h3>
          <ul>
            <li>Available systems</li>
            <li>Service warnings</li>
            <li>Ongoing issues</li>
            <li>Maintenance actions</li>
          </ul>
        </div>

        <div className="ph-card">
          <h3>Current Status</h3>
          <p>
            Services dashboard is in the planning phase. A structured reporting
            view will be introduced after module completion.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicesDashboard;
