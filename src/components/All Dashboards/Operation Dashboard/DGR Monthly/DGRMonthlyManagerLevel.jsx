import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ENGINE_KEYS,
  ENGINE_LABELS,
  FUEL_COLORS,
  formatNumber,
  MACHINE_COLORS,
  numberValue,
  OIL_KEYS,
  OIL_LABELS,
  subscribeMonthlyReports,
} from "../../../Daily Readings/Monthly DGR/monthlyFuelReportService";

function buildManagerRows(reports) {
  return reports.map((report) => ({
    monthKey: report.monthKey,
    hfoReceived: numberValue(report.oils?.hfo?.received),
    hfoClosing: numberValue(report.oils?.hfo?.closing),
    hfoTransferred: numberValue(report.oils?.hfo?.transferredToCement),
    lfoReceived: numberValue(report.oils?.lfo?.received),
    lfoClosing: numberValue(report.oils?.lfo?.closing),
    gasGeneration: numberValue(report.energy?.gasGenerationKwh),
    gasConsumption: numberValue(report.energy?.gasConsumptionNm3),
    totalGenerated: numberValue(report.energy?.generated),
    lubeClosing:
      numberValue(report.oils?.ti4040?.closing) +
      numberValue(report.oils?.ti4020?.closing) +
      numberValue(report.oils?.shellArginaS5Bn55?.closing) +
      numberValue(report.oils?.shellArginaS4Bn40?.closing),
  }));
}

export default function DGRMonthlyManagerLevel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeMonthlyReports(
      (items) => {
        setReports(items);
        setSelectedMonth((prev) => prev || items[0]?.monthKey || "");
        setLoading(false);
      },
      () => setLoading(false),
      "desc",
    );

    return () => unsubscribe();
  }, []);

  const rows = useMemo(() => buildManagerRows(reports), [reports]);

  const selectedReport = useMemo(
    () => reports.find((item) => item.monthKey === selectedMonth) || null,
    [reports, selectedMonth],
  );

  const machineSummary = useMemo(() => {
    if (!selectedReport?.machines) return [];
    return ENGINE_KEYS.map((key) => ({
      key,
      name: ENGINE_LABELS[key],
      generation: numberValue(selectedReport.machines[key]?.generation),
      hfo: numberValue(selectedReport.machines[key]?.hfo),
      lfo: numberValue(selectedReport.machines[key]?.lfo),
      lube:
        numberValue(selectedReport.machines[key]?.lubeTopup) +
        numberValue(selectedReport.machines[key]?.lubeReplace),
    }));
  }, [selectedReport]);

  const oilClosingSummary = useMemo(() => {
    if (!selectedReport?.oils) return [];
    return OIL_KEYS.map((key) => ({
      key,
      name: OIL_LABELS[key],
      closing: numberValue(selectedReport.oils[key]?.closing),
    }));
  }, [selectedReport]);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2 className="card-title">Manager Level Monthly View</h2>
      </div>
      <div className="card-content">
        {loading ? (
          <div className="alert alert-info">Loading monthly reports...</div>
        ) : reports.length === 0 ? (
          <div className="alert alert-warning">No monthly reports found.</div>
        ) : (
          <>
            <div className="form-group mb-4">
              <label className="form-label">Select Month</label>
              <select
                className="form-input input-date"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {reports.map((report) => (
                  <option key={report.id} value={report.monthKey}>
                    {report.monthKey}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                ["Total Generated", selectedReport?.energy?.generated],
                ["Gas Generation", selectedReport?.energy?.gasGenerationKwh],
                ["HFO Closing", selectedReport?.oils?.hfo?.closing],
                ["LFO Closing", selectedReport?.oils?.lfo?.closing],
              ].map(([label, value]) => (
                <div className="card p-3" key={label}>
                  <p className="text-sm text-secondary">{label}</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Monthly Oil and Gas Movement</h3>
              </div>
              <div className="card-content" style={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows.slice().reverse()} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthKey" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar
                      dataKey="hfoReceived"
                      name="HFO Received"
                      fill={FUEL_COLORS.hfo}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="lfoReceived"
                      name="LFO Received"
                      fill={FUEL_COLORS.lfo}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="hfoTransferred"
                      name="HFO to Cement"
                      fill={FUEL_COLORS.shellArginaS5Bn55}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="gasConsumption"
                      name="Gas NM3"
                      fill={FUEL_COLORS.gas}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Machine Generation</h3>
                </div>
                <div className="card-content" style={{ height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={machineSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value)} />
                      <Bar
                        dataKey="generation"
                        name="Generation KWH"
                        radius={[8, 8, 0, 0]}
                      >
                        {machineSummary.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={MACHINE_COLORS[entry.key]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Oil Closing Stock</h3>
                </div>
                <div className="card-content" style={{ height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={oilClosingSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value)} />
                      <Bar
                        dataKey="closing"
                        name="Closing Balance"
                        radius={[8, 8, 0, 0]}
                      >
                        {oilClosingSummary.map((entry) => (
                          <Cell key={entry.key} fill={FUEL_COLORS[entry.key]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Gen</th>
                    <th>Gas Gen</th>
                    <th>Gas NM3</th>
                    <th>HFO Rec</th>
                    <th>HFO Close</th>
                    <th>LFO Rec</th>
                    <th>LFO Close</th>
                    <th>Lube Close</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.monthKey}>
                      <td>{row.monthKey}</td>
                      <td>{formatNumber(row.totalGenerated)}</td>
                      <td>{formatNumber(row.gasGeneration)}</td>
                      <td>{formatNumber(row.gasConsumption)}</td>
                      <td>{formatNumber(row.hfoReceived)}</td>
                      <td>{formatNumber(row.hfoClosing)}</td>
                      <td>{formatNumber(row.lfoReceived)}</td>
                      <td>{formatNumber(row.lfoClosing)}</td>
                      <td>{formatNumber(row.lubeClosing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
