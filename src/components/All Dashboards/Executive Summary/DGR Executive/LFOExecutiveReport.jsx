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
import { formatNumber } from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

const CHART_COLORS = [
  "var(--primary-color)",
  "var(--success-color)",
  "var(--warning-color)",
  "var(--error-color)",
  "#8b5cf6",
  "#14b8a6",
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

export default function LFOExecutiveReport({ reports, summary, filters }) {
  const selectedEngine = filters?.engine || "all";

  const getLfoEngineValue = (report) => {
    if (selectedEngine === "all") return Number(report.oils.lfo.dgSets || 0);
    return Number(report.machines?.[selectedEngine]?.lfo || 0);
  };

  const lfoTrend = useMemo(
    () =>
      reports.map((item) => ({
        monthKey: item.monthKey,
        received: item.oils.lfo.received,
        closing: item.oils.lfo.closing,
        engineConsumption: getLfoEngineValue(item),
      })),
    [reports, selectedEngine],
  );

  const selectedEngineConsumption = lfoTrend.reduce(
    (sum, item) => sum + Number(item.engineConsumption || 0),
    0,
  );

  const consumptionPie = useMemo(() => {
    if (selectedEngine !== "all") {
      const total = reports.reduce(
        (sum, item) => sum + Number(item.machines?.[selectedEngine]?.lfo || 0),
        0,
      );

      return [
        {
          name: selectedEngine.toUpperCase(),
          value: total,
        },
      ].filter((item) => item.value > 0);
    }

    const total = reports.reduce(
      (acc, item) => {
        acc.dgSets += Number(item.oils.lfo.dgSets || 0);
        acc.blackStartVolvo +=
          Number(item.oils.lfo.bs || 0) + Number(item.oils.lfo.volvo || 0);
        acc.cat += Number(item.oils.lfo.cat || 0);
        acc.boilers += Number(item.oils.lfo.boilers || 0);
        acc.cementTransfer += Number(item.oils.lfo.transferredToCement || 0);
        return acc;
      },
      {
        dgSets: 0,
        blackStartVolvo: 0,
        cat: 0,
        boilers: 0,
        cementTransfer: 0,
      },
    );

    return [
      { name: "DG Sets", value: total.dgSets },
      { name: "Black Start (Volvo)", value: total.blackStartVolvo },
      { name: "CAT Engine", value: total.cat },
      { name: "Boilers", value: total.boilers },
      { name: "Cement Transfer", value: total.cementTransfer },
    ].filter((item) => item.value > 0);
  }, [reports, selectedEngine]);

  const cards = [
    {
      label: "LFO Received",
      value: summary.totals.lfoReceived,
      color: "var(--primary-color)",
    },
    {
      label:
        selectedEngine === "all"
          ? "LFO DG Consumption"
          : `${selectedEngine.toUpperCase()} LFO`,
      value: selectedEngineConsumption,
      color: "var(--warning-color)",
    },
    {
      label: "LFO Closing",
      value: summary.totals.lfoClosing,
      color: "var(--success-color)",
    },
    {
      label: "Selected Engine",
      value: selectedEngine === "all" ? summary.byMachine.length : 1,
      color: "var(--error-color)",
    },
  ];

  return (
    <ExecutiveReportShell
      title="LFO Executive Report"
      reportTitle="LFO Receiving, Closing Balance and Consumption Summary"
    >
      <ExecutiveKpiCards cards={cards} />

      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Monthly LFO Receiving</h3>
            </div>
            <div className="card-content chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lfoTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="monthKey" />
                  <YAxis width={"auto"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="received"
                    name="LFO Received"
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
                <AreaChart data={lfoTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="monthKey" />
                  <YAxis width={"auto"} />
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
              <h3 className="card-title">LFO Consumption Distribution</h3>
            </div>
            <div className="card-content" style={{ height: "24rem" }}>
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

      <div className="card-content overflow-x-auto">
        <h3 className="card-title mb-3">Monthly LFO Verification Table</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Received</th>
              <th>
                {selectedEngine === "all"
                  ? "DG Sets"
                  : `${selectedEngine.toUpperCase()} LFO`}
              </th>
              <th>Black Start / Volvo</th>
              <th>CAT</th>
              <th>Boilers</th>
              <th>Cement Transfer</th>
              <th>Closing</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item) => (
              <tr key={item.monthKey}>
                <td>{item.monthKey}</td>
                <td>{formatNumber(item.oils.lfo.received)}</td>
                <td>{formatNumber(getLfoEngineValue(item))}</td>
                <td>
                  {formatNumber(
                    Number(item.oils.lfo.bs || 0) +
                      Number(item.oils.lfo.volvo || 0),
                  )}
                </td>
                <td>{formatNumber(item.oils.lfo.cat)}</td>
                <td>{formatNumber(item.oils.lfo.boilers)}</td>
                <td>{formatNumber(item.oils.lfo.transferredToCement)}</td>
                <td>{formatNumber(item.oils.lfo.closing)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExecutiveReportShell>
  );
}
