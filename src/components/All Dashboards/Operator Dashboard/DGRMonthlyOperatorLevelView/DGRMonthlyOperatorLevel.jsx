import React, { useMemo, useState } from "react";
import MonthlyDGR from "../../../Daily Readings/Monthly DGR/MonthlyDGR";

export default function OperatorMonthlyView() {
  const [activeTab, setActiveTab] = useState("entry");

  const tabs = useMemo(
    () => [
      { key: "entry", label: "Monthly Entry" },
      { key: "help", label: "Instructions" },
    ],
    [],
  );

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2 className="card-title">Operator Level Monthly Report</h2>
      </div>
      <div className="card-content">
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`btn ${activeTab === tab.key ? "btn-primary" : "btn-warning"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "entry" ? (
          <MonthlyDGR />
        ) : (
          <div className="alert alert-info">
            Operator workflow: select month, verify opening balances, enter
            machine-wise data, add gas data if applicable, and verify HFO, LFO,
            and all lube oil closing balances before saving.
          </div>
        )}
      </div>
    </div>
  );
}
