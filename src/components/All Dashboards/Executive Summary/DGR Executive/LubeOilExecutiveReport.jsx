import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import ExecutiveKpiCards from "./ExecutiveKpiCards";
import ExecutiveReportShell from "./ExecutiveReportShell";
import {
  ACTIVE_LUBE_KEYS,
  formatNumber,
} from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

const CHART_COLORS = [
  "var(--primary-color)",
  "var(--success-color)",
  "var(--warning-color)",
  "var(--error-color)",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

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

export default function LubeOilExecutiveReport({ summary }) {
  const activeLubeTypes = summary.lubeByType.filter(
    (item) =>
      ACTIVE_LUBE_KEYS.includes(item.key) &&
      (item.opening > 0 ||
        item.received > 0 ||
        item.consumed > 0 ||
        item.closing > 0),
  );

  const historicalTi4040 = summary.lubeByType.find(
    (item) => item.key === "ti4040",
  );

  const cards = [
    {
      label: "Lube Received",
      value: summary.totals.lubeReceived,
      color: "var(--primary-color)",
    },
    {
      label: "Lube Consumed",
      value: summary.totals.lubeConsumed,
      color: "var(--warning-color)",
    },
    {
      label: "Lube Closing",
      value: summary.totals.lubeClosing,
      color: "var(--success-color)",
    },
    {
      label: "Active Types",
      value: 3,
      note: "TI4040 inactive",
      color: "var(--error-color)",
    },
  ];

  const closingMix = activeLubeTypes.map((item) => ({
    name: item.name,
    value: item.closing,
  }));

  return (
    <ExecutiveReportShell title="Lube Oil Executive Report">
      <ExecutiveKpiCards cards={cards} />

      {historicalTi4040?.consumed > 0 || historicalTi4040?.closing > 0 ? (
        <div className="alert alert-warning">
          <strong>Note:</strong> TI4040 exists in historical data but is no
          longer active. It is included in totals for historical accuracy.
        </div>
      ) : null}

      <div className="card-content chart-container">
        <h3 className="card-title mb-3">Active Lube Oil Movement</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeLubeTypes}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar
              dataKey="received"
              name="Received"
              fill="var(--primary-color)"
            />
            <Bar
              dataKey="consumed"
              name="Consumed"
              fill="var(--warning-color)"
            />
            <Bar dataKey="closing" name="Closing" fill="var(--success-color)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Closing Stock Mix</h3>
          </div>
          <div className="card-content chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={closingMix}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {closingMix.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lube Closing by Type</h3>
          </div>
          <div className="card-content chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeLubeTypes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="closing"
                  name="Closing"
                  stroke="var(--success-color)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="consumed"
                  name="Consumed"
                  stroke="var(--warning-color)"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ExecutiveReportShell>
  );
}
