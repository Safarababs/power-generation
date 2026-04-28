import React, { useState } from "react";
import useJsonExecutiveReports from "../../../Daily Readings/Monthly DGR/useJsonExecutiveReports";
import ExecutiveFilters from "../DGR Executive/ExecutiveFilters";
import EnergyExecutiveReport from "../DGR Executive//EnergyExecutiveReport";
import HFOExecutiveReport from "../DGR Executive//HFOExecutiveReport";
import LFOExecutiveReport from "../DGR Executive//LFOExecutiveReport";
import LubeOilExecutiveReport from "../DGR Executive//LubeOilExecutiveReport";
import RunningHoursGenerationReport from "../DGR Executive//RunningHoursGenerationReport";

export default function DGRMonthlyExecutive() {
  const {
    reports,
    summary,
    filters,
    setFilters,
    years,
    loading,
    error,
    reload,
  } = useJsonExecutiveReports();

  const [activeReport, setActiveReport] = useState("energy");

  const tabs = [
    { key: "energy", label: "ENERGY" },
    { key: "hours", label: "HOURS + GENERATION" },
    { key: "hfo", label: "HFO" },
    { key: "lfo", label: "LFO" },
    { key: "lube", label: "LUBE OIL" },
  ];

  return (
    <div className="card fade-in">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-2xl font-bold">Executive Monthly Reports</h2>
      </div>

      <div className="card-content flex flex-wrap gap-3 items-center border-b">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`btn ${activeReport === tab.key ? "btn-primary" : ""}`}
              onClick={() => setActiveReport(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-content">
        <ExecutiveFilters
          filters={filters}
          setFilters={setFilters}
          years={years}
          onReload={reload}
        />

        {loading ? (
          <div className="alert alert-info">
            Loading JSON executive reports...
          </div>
        ) : null}

        {error ? <div className="alert alert-danger">{error}</div> : null}

        {!loading && !error && reports.length === 0 ? (
          <div className="alert alert-warning">
            No records found for selected filters.
          </div>
        ) : null}

        {!loading && !error && reports.length > 0 ? (
          <>
            {activeReport === "energy" ? (
              <EnergyExecutiveReport reports={reports} summary={summary} />
            ) : null}

            {activeReport === "hours" ? (
              <RunningHoursGenerationReport
                reports={reports}
                summary={summary}
              />
            ) : null}

            {activeReport === "hfo" ? (
              <HFOExecutiveReport reports={reports} summary={summary} />
            ) : null}

            {activeReport === "lfo" ? (
              <LFOExecutiveReport reports={reports} summary={summary} />
            ) : null}

            {activeReport === "lube" ? (
              <LubeOilExecutiveReport reports={reports} summary={summary} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
