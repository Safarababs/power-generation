import React from "react";

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatHours(value) {
  return `${formatNumber(value, 2)} hrs`;
}

export default function MillSummaryTable({ yesterdayMillSummary = [] }) {
  return (
    <section className="card operator-panel-card compact-table-card">
      <div className="card-header">
        <h3 className="card-title">Yesterday Mill Summary (6AM → 6AM)</h3>
      </div>

      <div className="card-content operator-stoppage-table-wrap">
        <table className="table operator-compact-table">
          <thead>
            <tr>
              <th>Mill</th>
              <th>Stop Hrs</th>
              <th>Run Hrs</th>
              <th>Status</th>
              <th>Since</th>
            </tr>
          </thead>

          <tbody>
            {yesterdayMillSummary.map((item) => (
              <tr key={item.millName}>
                <td>{item.millName}</td>
                <td className="text-red font-semibold">
                  {formatHours(item.totalStoppedHours)}
                </td>
                <td className="text-green font-semibold">
                  {formatHours(item.totalRunningHours)}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      item.currentStatus === "RUNNING"
                        ? "status-online"
                        : "status-critical"
                    }`}
                  >
                    {item.currentStatus}
                  </span>
                </td>
                <td>{item.currentSince}</td>
              </tr>
            ))}

            {!yesterdayMillSummary.length && (
              <tr>
                <td colSpan="5" className="text-center text-secondary">
                  No mill summary found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
