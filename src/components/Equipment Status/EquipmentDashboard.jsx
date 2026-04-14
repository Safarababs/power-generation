import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

function formatDate(value) {
  if (!value) return "-";
  if (value?.toDate) {
    return value.toDate().toLocaleString();
  }
  return new Date(value).toLocaleString();
}

export default function EquipmentDashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [activeKpi, setActiveKpi] = useState("Running");

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

  const summary = useMemo(() => {
    return {
      running: records.filter((r) => r.mode === "R").length,
      OK: records.filter((r) => r.status === "Ok").length,
      standby: records.filter((r) => r.mode === "SB").length,
      maintenance: records.filter((r) => r.mode === "UM").length,
      warning: records.filter((r) => r.status === "Warning").length,
      critical: records.filter((r) => r.status === "Critical").length,
    };
  }, [records]);

  const kpiButtons = useMemo(
    () => [
      {
        key: "Running",
        label: "Running",
        count: summary.running,
        filter: (item) => item.mode === "R",
        className: "eqs-kpi-running",
      },
      {
        key: "OK",
        label: "OK",
        count: summary.OK,
        filter: (item) => item.status === "Ok",
        className: "eqs-kpi-ok",
      },
      {
        key: "Stand By",
        label: "Stand By",
        count: summary.standby,
        filter: (item) => item.mode === "SB",
        className: "eqs-kpi-standby",
      },
      {
        key: "Under Maintenance",
        label: "Under Maintenance",
        count: summary.maintenance,
        filter: (item) => item.mode === "UM",
        className: "eqs-kpi-maintenance",
      },
      {
        key: "Warning",
        label: "Warning",
        count: summary.warning,
        filter: (item) => item.status === "Warning",
        className: "eqs-kpi-warning",
      },
      {
        key: "Critical",
        label: "Critical",
        count: summary.critical,
        filter: (item) => item.status === "Critical",
        className: "eqs-kpi-critical",
      },
    ],
    [summary],
  );

  const selectedKpi = useMemo(() => {
    return kpiButtons.find((item) => item.key === activeKpi) || kpiButtons[0];
  }, [activeKpi, kpiButtons]);

  const filteredRecords = useMemo(() => {
    const searchText = search.toLowerCase();

    return records.filter((item) => {
      const matchesKpi = selectedKpi.filter(item);

      const text =
        `${item.equipmentName || ""} ${item.mode || ""} ${item.status || ""} ${item.remarks || ""}`.toLowerCase();

      const matchesSearch = text.includes(searchText);

      return matchesKpi && matchesSearch;
    });
  }, [records, search, selectedKpi]);

  return (
    <div className="eqs-dashboard-wrap">
      <div className="eqs-page-heading">
        <h2 className="eqs-page-title">Equipment Status</h2>
        <p className="eqs-page-subtitle">
          Click any KPI button to view related equipment list
        </p>
      </div>

      {/* 6 KPI buttons in one row */}
      <div className="eqs-kpi-grid">
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

      <div className="eqs-card">
        <div className="eqs-card-header eqs-table-header">
          <div>
            <h3 className="eqs-title">{activeKpi} Equipments</h3>
            <p className="eqs-subtitle">
              Showing all equipment records related to selected KPI
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
                <th>Time</th>
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

                    {/* Mode remains based on actual mode */}
                    <td>
                      {item.mode === "R"
                        ? "Running"
                        : item.mode === "SB"
                          ? "Stand By"
                          : item.mode === "UM"
                            ? "Under Maintenance"
                            : item.mode}
                    </td>

                    {/* Status remains separate */}
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
