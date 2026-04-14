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

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const text =
        `${item.equipmentName} ${item.mode} ${item.status} ${item.remarks || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [records, search]);

  const summary = useMemo(() => {
    const okCount = records.filter((r) => r.status === "Ok").length;
    const warningCount = records.filter((r) => r.status === "Warning").length;
    const criticalCount = records.filter((r) => r.status === "Critical").length;

    const runningCount = records.filter((r) => r.mode === "R").length;
    const standbyCount = records.filter((r) => r.mode === "SB").length;
    const maintenanceCount = records.filter((r) => r.mode === "UM").length;
    const autoCount = records.filter((r) => r.mode === "A").length;
    const manualCount = records.filter((r) => r.mode === "M").length;

    return {
      okCount,
      warningCount,
      criticalCount,
      runningCount,
      standbyCount,
      maintenanceCount,
      autoCount,
      manualCount,
    };
  }, [records]);

  const criticalItems = useMemo(() => {
    return records.filter((item) => item.status === "Critical").slice(0, 10);
  }, [records]);

  const warningItems = useMemo(() => {
    return records.filter((item) => item.status === "Warning").slice(0, 10);
  }, [records]);

  const recentItems = useMemo(() => {
    return filteredRecords.slice(0, 20);
  }, [filteredRecords]);

  return (
    <div className="eqs-dashboard-wrap">
      <div className="eqs-page-heading">
        <h2 className="eqs-page-title">Equipment Status</h2>
        <p className="eqs-page-subtitle">
          KPI, critical alerts, operational mode view, and recent equipment
          updates
        </p>
      </div>

      <div className="eqs-kpi-grid">
        <div className="eqs-kpi-card eqs-kpi-ok">
          <h4>OK</h4>
          <span>{summary.okCount}</span>
        </div>
        <div className="eqs-kpi-card eqs-kpi-warning">
          <h4>Warning</h4>
          <span>{summary.warningCount}</span>
        </div>
        <div className="eqs-kpi-card eqs-kpi-critical">
          <h4>Critical</h4>
          <span>{summary.criticalCount}</span>
        </div>
      </div>

      <div className="eqs-kpi-grid">
        <div className="eqs-kpi-card">
          <h4>Running</h4>
          <span>{summary.runningCount}</span>
        </div>
        <div className="eqs-kpi-card">
          <h4>Stand By</h4>
          <span>{summary.standbyCount}</span>
        </div>
        <div className="eqs-kpi-card">
          <h4>Under Maintenance</h4>
          <span>{summary.maintenanceCount}</span>
        </div>
      </div>

      <div className="eqs-management-grid">
        <div className="eqs-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Critical Equipments</h3>
            <p className="eqs-subtitle">
              Immediate management attention required
            </p>
          </div>
          <div className="eqs-card-body">
            {criticalItems.length === 0 ? (
              <p>No critical records.</p>
            ) : (
              criticalItems.map((item) => (
                <div key={item.id} className="eqs-alert-item eqs-critical-item">
                  <strong>{item.equipmentName}</strong>
                  <p>Status: {item.status}</p>
                  <p>Mode: {item.mode}</p>
                  <p>Remarks: {item.remarks || "-"}</p>
                  <p>Time: {formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="eqs-card">
          <div className="eqs-card-header">
            <h3 className="eqs-title">Warning Equipments</h3>
            <p className="eqs-subtitle">
              Need observation and follow-up action
            </p>
          </div>
          <div className="eqs-card-body">
            {warningItems.length === 0 ? (
              <p>No warning records.</p>
            ) : (
              warningItems.map((item) => (
                <div key={item.id} className="eqs-alert-item eqs-warning-item">
                  <strong>{item.equipmentName}</strong>
                  <p>Status: {item.status}</p>
                  <p>Mode: {item.mode}</p>
                  <p>Remarks: {item.remarks || "-"}</p>
                  <p>Time: {formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="eqs-card">
        <div className="eqs-card-header eqs-table-header">
          <div>
            <h3 className="eqs-title">Recent Operational Updates</h3>
            <p className="eqs-subtitle">
              Equipment records for analysis and decisions
            </p>
          </div>

          <input
            type="text"
            className="eqs-input eqs-search-input"
            placeholder="Search equipment, mode, status, remarks..."
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
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                recentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.equipmentName}</td>
                    <td>{item.mode}</td>
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
                        {item.status}
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
