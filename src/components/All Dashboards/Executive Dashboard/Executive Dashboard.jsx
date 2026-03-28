import React from "react";
import OperationDashboard from "../Operation Dashboard/OperationDashboard";

function ExecutiveDashboard() {
  return (
    <div className="executive-dashboard">
      {/* Heading */}
      <header className="title">
        <h1>Executive Dashboard – Power Plant Overview</h1>
      </header>
      <OperationDashboard />

      {/* KPI Cards */}
      {/* <section className="kpi-section">
        <div className="kpi-card">Total Power Generated: 120 MW</div>
        <div className="kpi-card">Availability: 95%</div>
        <div className="kpi-card">Fuel Consumption: 3000 L/day</div>
        <div className="kpi-card">Safety Incidents: 0</div>
      </section> */}

      {/* Department Summaries */}
      {/* <section className="department-section">
        <h2>Operations</h2>
        <p>Stoppages: 2 | Efficiency: 88%</p>

        <h2>Mechanical</h2>
        <p>Equipment Health: Stable | Maintenance Backlog: 3 tasks</p>

        <h2>Electrical</h2>
        <p>Load Distribution: Balanced | Relay Trips: 1</p>

        <h2>Utility</h2>
        <p>Water Usage: 500 m³ | Fuel Usage: 3000 L</p>

        <h2>Services</h2>
        <p>HR Attendance: 98% | Procurement: On Track</p>
      </section> */}

      {/* Alerts */}
      {/* <section className="alerts-section">
        <h2>Critical Alerts</h2>
        <ul>
          <li>Fuel stock below threshold</li>
          <li>Scheduled maintenance overdue</li>
        </ul>
      </section> */}
    </div>
  );
}

export default ExecutiveDashboard;
