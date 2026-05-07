import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
    <div className="card shadow-md p-3" style={{ margin: 0 }}>
      <p className="text-sm font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

function pieLabel({ name, percent }) {
  return `${name} ${(percent * 100).toFixed(1)}%`;
}

export default function LubeOilExecutiveReport({ reports, summary, filters }) {
  const selectedEngine = filters?.engine || "all";

  const engineLubeRows = useMemo(() => {
    return reports.flatMap((report) => {
      const engineKeys =
        selectedEngine === "all"
          ? Object.keys(report.machines || {})
          : [selectedEngine];

      return engineKeys.flatMap((engineKey) => {
        const engine = report.machines?.[engineKey];
        const lubeUsage = engine?.lubeUsage || {};

        return Object.entries(lubeUsage)
          .map(([lubeKey, usage]) => ({
            monthKey: report.monthKey,
            engine: engineKey.toUpperCase(),
            lubeKey,
            consumed: Number(usage?.total || 0),
          }))
          .filter((row) => row.consumed > 0);
      });
    });
  }, [reports, selectedEngine]);
  const lubeMonthlyTrend = useMemo(
    () =>
      reports.map((item) => ({
        monthKey: item.monthKey,
        received: item.oils.lubeOil.total.received,
        consumed: item.oils.lubeOil.total.totalConsumption,
        closing: item.oils.lubeOil.total.closing,
      })),
    [reports],
  );

  const lubeTypeSummary = useMemo(
    () =>
      summary.lubeByType.filter(
        (item) =>
          item.opening > 0 ||
          item.received > 0 ||
          item.consumed > 0 ||
          item.closing > 0,
      ),
    [summary.lubeByType],
  );

  const activeLubeTypes = useMemo(
    () => lubeTypeSummary.filter((item) => ACTIVE_LUBE_KEYS.includes(item.key)),
    [lubeTypeSummary],
  );

  const historicalTi4040 = summary.lubeByType.find(
    (item) => item.key === "ti4040",
  );

  const lubeReceived = lubeTypeSummary.reduce(
    (sum, item) => sum + Number(item.received || 0),
    0,
  );

  const lubeConsumed = lubeTypeSummary.reduce(
    (sum, item) => sum + Number(item.consumed || 0),
    0,
  );

  const latestClosing = reports.at(-1)?.oils?.lubeOil?.total?.closing || 0;

  const consumptionPie = lubeTypeSummary
    .map((item) => ({
      name: item.name,
      value: item.consumed,
    }))
    .filter((item) => item.value > 0);

  const cards = [
    {
      label: "Lube Received",
      value: lubeReceived,
      color: "var(--primary-color)",
    },
    {
      label: "Lube Consumed",
      value: lubeConsumed,
      color: "var(--warning-color)",
    },
    {
      label: "Latest Closing",
      value: latestClosing,
      color: "var(--success-color)",
    },
    {
      label: "Active Types",
      value: activeLubeTypes.length,
      note: "TI4040 historical only",
      color: "var(--error-color)",
    },
  ];

  return (
    <ExecutiveReportShell title="Lube Oil Executive Report">
      <ExecutiveKpiCards cards={cards} />

      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Monthly Lube Oil Receiving</h3>
            </div>
            <div className="card-content chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lubeMonthlyTrend}>
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
                    dataKey="received"
                    name="Lube Received"
                    stroke="var(--primary-color)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Monthly Closing Balance</h3>
            </div>
            <div className="card-content chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lubeMonthlyTrend}>
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
                    dataKey="closing"
                    name="Closing Balance"
                    stroke="var(--success-color)"
                    fill="var(--success-color)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-1 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lube Oil Consumption Distribution</h3>
            </div>
            <div className="card-content " style={{ height: "24rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consumptionPie}
                    dataKey="value"
                    nameKey="name"
                    label={pieLabel}
                  >
                    {consumptionPie.map((entry, index) => (
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
        </div>
      </div>
      {historicalTi4040?.consumed > 0 || historicalTi4040?.closing > 0 ? (
        <div className="alert alert-warning">
          <strong>Note:</strong> TI4040 exists in historical data but is no
          longer active. It is included in totals for historical accuracy.
        </div>
      ) : null}
      <div className="card-content overflow-x-auto">
        <h3 className="card-title mb-3">Lube Oil Verification Table</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Engine</th>
              <th>Lube Type</th>
              <th>Consumed</th>
            </tr>
          </thead>
          <tbody>
            {engineLubeRows.map((row) => (
              <tr key={`${row.monthKey}-${row.engine}-${row.lubeKey}`}>
                <td>{row.monthKey}</td>
                <td>{row.engine}</td>
                <td>{row.lubeKey}</td>
                <td>{formatNumber(row.consumed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExecutiveReportShell>
  );
}
