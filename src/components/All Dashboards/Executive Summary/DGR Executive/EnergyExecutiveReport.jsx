import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import ExecutiveKpiCards from "./ExecutiveKpiCards";
import ExecutiveReportShell from "./ExecutiveReportShell";
import { formatNumber } from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

/* ===== Custom Tooltip (same as your feeder style) ===== */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="card shadow-md p-3">
      <p className="text-sm font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function EnergyExecutiveReport({ summary }) {
  const cards = [
    {
      label: "Total Generation",
      value: summary.totals.totalGeneration,
      color: "var(--primary-color)",
    },
    {
      label: "Gas Generation",
      value: summary.totals.gasGeneration,
      color: "var(--success-color)",
    },
    {
      label: "HFO Generation",
      value: summary.totals.hfoGeneration,
      color: "var(--warning-color)",
    },
    {
      label: "Gas Consumption",
      value: summary.totals.gasConsumption,
      color: "var(--error-color)",
    },
  ];

  return (
    <ExecutiveReportShell title="Energy & Fuel Report">
      <ExecutiveKpiCards cards={cards} />

      {/* ===== STACKED AREA (MAIN EXECUTIVE VIEW) ===== */}
      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Monthly Generation</h3>
            </div>
            <div className="card-content chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.byMonth}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="monthKey" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="totalGeneration"
                    name="Total Generation"
                    stroke="var(--primary-color)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Generation Split HFO / GAS</h3>
            </div>

            <div className="card-content chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.byMonth}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="monthKey" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="gasGeneration"
                    name="Gas"
                    stackId="1"
                    stroke="var(--success-color)"
                    fill="var(--success-color)"
                  />
                  <Area
                    type="monotone"
                    dataKey="hfoGeneration"
                    name="HFO"
                    stackId="1"
                    stroke="var(--primary-color)"
                    fill="var(--primary-color)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ===== ENGINE CONTRIBUTION ===== */}
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 pd-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Engine Generation</h3>
              </div>
              <div className="card-content chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.byMachine}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    <Bar
                      dataKey="generation"
                      name="Generation"
                      fill="var(--primary-color)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===============Reports Table================ */}
      <div className="card-content overflow-x-auto">
        <h3 className="card-title mb-3">Monthly Energy Verification Table</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Generation</th>
              <th>Gas Generation</th>
              <th>HFO Generation</th>
              <th>Gas Consumption</th>
              <th>Running Hours</th>
            </tr>
          </thead>

          <tbody>
            {summary.byMonth.map((item) => (
              <tr key={item.monthKey}>
                <td>{item.monthKey}</td>
                <td>{formatNumber(item.totalGeneration)}</td>
                <td>{formatNumber(item.gasGeneration)}</td>
                <td>{formatNumber(item.hfoGeneration)}</td>
                <td>{formatNumber(item.gasConsumption)}</td>
                <td>{formatNumber(item.runningHours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExecutiveReportShell>
  );
}
