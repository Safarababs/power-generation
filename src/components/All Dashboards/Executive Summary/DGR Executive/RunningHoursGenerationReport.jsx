import React from "react";
import {
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import ExecutiveKpiCards from "./ExecutiveKpiCards";
import ExecutiveReportShell from "./ExecutiveReportShell";
import { formatNumber } from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

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

export default function RunningHoursGenerationReport({ summary }) {
  const pieData = summary.byMachine.map((item) => ({
    name: item.name,
    value: item.generation,
  }));

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
  ];

  const bestEngine = summary.byMachine.reduce(
    (best, item) => (item.generation > best.generation ? item : best),
    { name: "No Data", generation: 0 },
  );

  const cards = [
    {
      label: "Running Hours",
      value: summary.totals.runningHours,
      color: "var(--warning-color)",
    },
    {
      label: "Total Generation",
      value: summary.totals.totalGeneration,
      color: "var(--primary-color)",
    },
    {
      label: "Best Engine",
      value: bestEngine.generation,
      note: bestEngine.name,
      color: "var(--success-color)",
    },
    {
      label: "Machines",
      value: summary.byMachine.length,
      color: "var(--error-color)",
    },
  ];

  return (
    <ExecutiveReportShell title="Running Hours & Generation Report">
      <ExecutiveKpiCards cards={cards} />

      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Engine Running Hours vs Generation</h3>
            </div>
            <div className="card-content " style={{ height: "24rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={summary.byMachine}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  <Bar
                    yAxisId="left"
                    dataKey="runningHours"
                    name="Running Hours"
                    fill="var(--warning-color)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="generation"
                    name="Generation"
                    stroke="var(--primary-color)"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Engine Generation Share</h3>
            </div>
            <div className="card-content" style={{ height: "24rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" label>
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="card-content overflow-x-auto">
        <h3 className="card-title mb-3">Engine Verification Table</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Engine</th>
              <th>Running Hours</th>
              <th>Generation</th>
              <th>HFO</th>
              <th>LFO</th>
              <th>Lube Oil</th>
            </tr>
          </thead>
          <tbody>
            {summary.byMachine.map((item) => (
              <tr key={item.key}>
                <td>{item.name}</td>
                <td>{formatNumber(item.runningHours)}</td>
                <td>{formatNumber(item.generation)}</td>
                <td>{formatNumber(item.hfo)}</td>
                <td>{formatNumber(item.lfo)}</td>
                <td>{formatNumber(item.lube)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExecutiveReportShell>
  );
}
