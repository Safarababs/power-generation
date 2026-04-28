import React from "react";
import {
  ENGINE_KEYS,
  ENGINE_LABELS,
} from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

const months = [
  ["all", "All Months"],
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
];

export default function ExecutiveFilters({
  filters,
  setFilters,
  years,
  onReload,
}) {
  const update = (field, value) =>
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Executive Filters</h3>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Year</label>
            <select
              className="form-input"
              value={filters.year}
              onChange={(event) => update("year", event.target.value)}
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Month</label>
            <select
              className="form-input"
              value={filters.month}
              onChange={(event) => update("month", event.target.value)}
            >
              {months.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Engine</label>
            <select
              className="form-input"
              value={filters.engine}
              onChange={(event) => update("engine", event.target.value)}
            >
              <option value="all">All Engines</option>
              {ENGINE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {ENGINE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div
            className="form-group flex items-center"
            style={{ alignItems: "end" }}
          >
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={onReload}
            >
              Reload JSON
            </button>
          </div>
        </div>

        <div className="alert alert-info mt-4">
          Use <strong>All Years</strong> for overview, select a year for annual
          review, select a month for a specific report, or select an engine for
          machine-focused analysis.
        </div>
      </div>
    </div>
  );
}
