import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { db } from "../FIrestore/firebase";
import "./equipmentStatus.css";

const STATUS_COLORS = {
  OK: "#22c55e",
  Warning: "#f59e0b",
  "Under Maintenance": "var(--error-color)",
};

const MODE_COLORS = {
  Running: "#3b82f6",
  "Stand By": "#64748b",
  Auto: "#06b6d4",
  Manual: "#f97316",
  "Under Maintenance": "var(--error-color)",
};

function formatDate(value) {
  if (!value) return "-";
  if (value?.toDate)
    return value.toDate().toLocaleString("en-US", {
      month: "long",

      year: "numeric",
    });
  return value.toLocaleString("en-US", {
    month: "long",

    year: "numeric",
  });
}

function getModeLabel(mode) {
  if (mode === "R") return "Running";
  if (mode === "SB") return "Stand By";
  if (mode === "UM") return "Under Maintenance";
  if (mode === "A") return "Auto";
  if (mode === "M") return "Manual";
  return mode || "-";
}

function getLatestPerEquipment(records) {
  const latestMap = new Map();

  records.forEach((item) => {
    const key = item.equipmentName || "Unknown";

    const currentTime = item.createdAt?.toDate
      ? item.createdAt.toDate().getTime()
      : item.createdAt
        ? new Date(item.createdAt).getTime()
        : 0;

    const existing = latestMap.get(key);

    const existingTime = existing?.createdAt?.toDate
      ? existing.createdAt.toDate().getTime()
      : existing?.createdAt
        ? new Date(existing.createdAt).getTime()
        : 0;

    if (!existing || currentTime > existingTime) {
      latestMap.set(key, item);
    }
  });

  return Array.from(latestMap.values());
}

export default function EquipmentExecutiveSummary() {
  const [records, setRecords] = useState([]);
  const [activeKpi, setActiveKpi] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "equipment_status"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(list);
    });

    return () => unsubscribe();
  }, []);

  const latestRecords = useMemo(
    () => getLatestPerEquipment(records),
    [records],
  );

  const summary = useMemo(() => {
    return {
      all: latestRecords.length,
      running: latestRecords.filter((r) => r.mode === "R").length,
      standby: latestRecords.filter((r) => r.mode === "SB").length,
      auto: latestRecords.filter((r) => r.mode === "A").length,
      manual: latestRecords.filter((r) => r.mode === "M").length,
      ok: latestRecords.filter((r) => r.status === "Ok").length,
      warning: latestRecords.filter((r) => r.status === "Warning").length,
      maintenance: latestRecords.filter(
        (r) => r.mode === "UM" || r.status === "Critical",
      ).length,
    };
  }, [latestRecords]);

  const healthScore = useMemo(() => {
    if (!summary.all) return 0;
    return Math.round((summary.ok / summary.all) * 100);
  }, [summary]);

  const kpiButtons = useMemo(
    () => [
      {
        key: "All",
        label: "All Equipments",
        count: summary.all,
        filter: () => true,
        className: "eqs-kpi-all",
      },
      {
        key: "Running",
        label: "Running",
        count: summary.running,
        filter: (item) => item.mode === "R",
        className: "eqs-kpi-running",
      },
      {
        key: "Stand By",
        label: "Stand By",
        count: summary.standby,
        filter: (item) => item.mode === "SB",
        className: "eqs-kpi-standby",
      },
      {
        key: "Auto",
        label: "Auto",
        count: summary.auto,
        filter: (item) => item.mode === "A",
        className: "eqs-kpi-auto",
      },
      {
        key: "Manual",
        label: "Manual",
        count: summary.manual,
        filter: (item) => item.mode === "M",
        className: "eqs-kpi-manual",
      },
      {
        key: "OK",
        label: "OK",
        count: summary.ok,
        filter: (item) => item.status === "Ok",
        className: "eqs-kpi-ok",
      },
      {
        key: "Warning",
        label: "Warning",
        count: summary.warning,
        filter: (item) => item.status === "Warning",
        className: "eqs-kpi-warning",
      },
      {
        key: "Under Maintenance",
        label: "Under Maintenance",
        count: summary.maintenance,
        filter: (item) => item.mode === "UM" || item.status === "Critical",
        className: "eqs-kpi-maintenance",
      },
    ],
    [summary],
  );

  const selectedKpi = useMemo(() => {
    return kpiButtons.find((item) => item.key === activeKpi) || kpiButtons[0];
  }, [activeKpi, kpiButtons]);

  const executiveStatusData = useMemo(
    () => [
      { name: "OK", value: summary.ok },
      { name: "Warning", value: summary.warning },
      { name: "Under Maintenance", value: summary.maintenance },
    ],
    [summary],
  );

  const modeChartData = useMemo(
    () => [
      { name: "Running", value: summary.running },
      { name: "Stand By", value: summary.standby },
      { name: "Auto", value: summary.auto },
      { name: "Manual", value: summary.manual },
      { name: "Under Maintenance", value: summary.maintenance },
    ],
    [summary],
  );

  const executiveInsights = useMemo(() => {
    const insights = [];

    insights.push(`Total active equipment in executive view: ${summary.all}.`);
    insights.push(`Operational health score is ${healthScore}%.`);

    if (summary.maintenance > 0) {
      insights.push(
        `${summary.maintenance} equipment items are under maintenance, including critical-condition equipment.`,
      );
    }

    if (summary.warning > 0) {
      insights.push(
        `${summary.warning} equipment items are in warning status and need close monitoring.`,
      );
    }

    if (summary.running > 0) {
      insights.push(
        `${summary.running} equipment items are currently running.`,
      );
    }

    return insights;
  }, [summary, healthScore]);

  const filteredRecords = useMemo(() => {
    const searchText = search.toLowerCase();

    return latestRecords.filter((item) => {
      const matchesKpi = selectedKpi.filter(item);

      const text =
        `${item.equipmentName || ""} ${item.mode || ""} ${item.status || ""} ${item.remarks || ""}`.toLowerCase();

      const matchesSearch = text.includes(searchText);

      return matchesKpi && matchesSearch;
    });
  }, [latestRecords, selectedKpi, search]);

  return (
    <div className="eqs-dashboard-wrap">
      <div className="eqs-page-heading">
        <h2 className="eqs-page-title">Equipment Summary</h2>
        <p className="eqs-page-subtitle">
          Equipment analysis based on latest equipment status
        </p>
      </div>

      <div className="eqs-exec-top-grid">
        <div className="eqs-card eqs-exec-hero-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Equipments Health Score</h3>
            <p className="eqs-subtitle">Health = OK / Total * 100</p>
          </div>
          <div className="eqs-card-body">
            <div className="eqs-health-score">
              {healthScore.toFixed(0)}% (Equipment Health)
            </div>
            <div className="eqs-health-meta">
              <div>
                <strong>Total:</strong> {summary.all}
              </div>
              <div>
                <strong>OK:</strong> {summary.ok}
              </div>
              <div>
                <strong>Warning:</strong> {summary.warning}
              </div>
            </div>
          </div>
        </div>

        <div className="eqs-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Equipment Insights</h3>
            <p className="eqs-subtitle">
              Current highlights for leadership review
            </p>
          </div>
          <div className="eqs-card-body">
            <ul className="eqs-exec-insights">
              {executiveInsights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="eqs-exec-kpi-grid">
        {kpiButtons.map((kpi) => (
          <button
            key={kpi.key}
            type="button"
            onClick={() => setActiveKpi(kpi.key)}
            className={`eqs-kpi-card ${kpi.className} ${
              activeKpi === kpi.key ? "active" : ""
            }`}
          >
            <h4>{kpi.label}</h4>
            <span>{kpi.count}</span>
          </button>
        ))}
      </div>

      <div className="eqs-management-grid">
        <div className="eqs-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Executive Status Distribution</h3>
            <p className="eqs-subtitle">KPI-aligned health distribution</p>
          </div>
          <div className="eqs-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={executiveStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {executiveStatusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="eqs-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Mode Distribution</h3>
            <p className="eqs-subtitle">Latest operating mode overview</p>
          </div>
          <div className="eqs-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {modeChartData.map((entry) => (
                    <Cell key={entry.name} fill={MODE_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="eqs-card">
        <div className="eqs-card-header eqs-table-header">
          <div>
            <h3 className="eqs-title">{activeKpi} Equipments</h3>
            <p className="eqs-subtitle">
              Click any KPI card to view all related equipment
            </p>
          </div>

          <input
            type="text"
            className="eqs-input eqs-search-input"
            placeholder={`Search in ${activeKpi} equipment list...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="eqs-card-body eqs-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Equipment</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Fault Exist date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.equipmentName}</td>
                    <td>{getModeLabel(item.mode)}</td>
                    <td>
                      <span
                        className={
                          item.status === "Critical"
                            ? "status-badge status-critical"
                            : item.status === "Warning"
                              ? "status-badge status-warning"
                              : "status-badge status-online"
                        }
                      >
                        {item.status || "Ok"}
                      </span>
                    </td>
                    <td>{item.remarks || "-"}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
