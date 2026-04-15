import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../FIrestore/firebase";
import "./equipmentStatus.css";

function formatDate(value) {
  if (!value) return "-";
  if (value?.toDate) {
    return value.toDate().toLocaleString();
  }
  return new Date(value).toLocaleString();
}

export default function EquipmentDashboard({ currentUser }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [activeKpi, setActiveKpi] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    equipmentName: "",
    mode: "",
    status: "",
    remarks: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "equipment_status"),
      orderBy("createdAt", "asc"),
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
      All: records.length,
      running: records.filter((r) => r.mode === "R").length,
      auto: records.filter((r) => r.mode === "A").length,
      manual: records.filter((r) => r.mode === "M").length,
      OK: records.filter((r) => r.status === "Ok").length,
      standby: records.filter((r) => r.mode === "SB").length,
      maintenance: records.filter(
        (r) => r.mode === "UM" || r.status === "Critical",
      ).length,
      warning: records.filter((r) => r.status === "Warning").length,
    };
  }, [records]);

  const kpiButtons = useMemo(
    () => [
      {
        key: "All",
        label: "All Equipments",
        count: summary.All,
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
        key: "manual",
        label: "Manual",
        count: summary.manual,
        filter: (item) => item.mode === "M",
        className: "eqs-kpi-manual",
      },
      {
        key: "OK",
        label: "OK",
        count: summary.OK,
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
        filter: (item) => item.mode === "UM",
        className: "eqs-kpi-maintenance",
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

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      equipmentName: item.equipmentName || "",
      mode: item.mode || "",
      status: item.status || "",
      remarks: item.remarks || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      equipmentName: "",
      mode: "",
      status: "",
      remarks: "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveEdit = async (id) => {
    try {
      setSaving(true);

      await updateDoc(doc(db, "equipment_status", id), {
        equipmentName: editForm.equipmentName,
        mode: editForm.mode,
        status: editForm.status,
        remarks: editForm.remarks,
      });

      cancelEdit();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update equipment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "equipment_status", id));

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete equipment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="eqs-dashboard-wrap">
        <div className="eqs-page-heading">
          <h2 className="eqs-page-title">Equipment Status</h2>
          <p className="eqs-page-subtitle">
            Click any KPI button to view related equipment list
          </p>
        </div>

        {/* 7 KPI buttons in one row */}
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
                  {currentUser?.department === "operation" &&
                    (currentUser?.designation === "developer" ||
                      currentUser?.designation === "MO") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => {
                    const isEditing = editingId === item.id;

                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              className="eqs-input"
                              value={editForm.equipmentName}
                              onChange={(e) =>
                                handleEditChange(
                                  "equipmentName",
                                  e.target.value,
                                )
                              }
                            />
                          ) : (
                            item.equipmentName
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="eqs-select"
                              value={editForm.mode}
                              onChange={(e) =>
                                handleEditChange("mode", e.target.value)
                              }
                            >
                              <option value="R">Running</option>
                              <option value="SB">Stand By</option>
                              <option value="UM">Under Maintenance</option>
                              <option value="A">Auto</option>
                              <option value="M">Manual</option>
                            </select>
                          ) : item.mode === "R" ? (
                            "Running"
                          ) : item.mode === "SB" ? (
                            "Stand By"
                          ) : item.mode === "UM" ? (
                            "Under Maintenance"
                          ) : (
                            item.mode
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="eqs-select"
                              value={editForm.status}
                              onChange={(e) =>
                                handleEditChange("status", e.target.value)
                              }
                            >
                              <option value="Ok">Ok</option>
                              <option value="Warning">Warning</option>
                              <option value="Critical">Critical</option>
                            </select>
                          ) : (
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
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              className="eqs-input"
                              value={editForm.remarks}
                              onChange={(e) =>
                                handleEditChange("remarks", e.target.value)
                              }
                            />
                          ) : (
                            item.remarks || "-"
                          )}
                        </td>

                        <td>{formatDate(item.createdAt)}</td>

                        <td>
                          <div className="eqs-action-btns">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="eqs-table-btn eqs-save-btn"
                                  onClick={() => saveEdit(item.id)}
                                  disabled={saving}
                                >
                                  {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                  type="button"
                                  className="eqs-table-btn eqs-cancel-btn"
                                  onClick={cancelEdit}
                                  disabled={saving}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                {currentUser?.department === "operation" &&
                                (currentUser?.designation === "developer" ||
                                  currentUser?.designation === "MO") ? (
                                  <>
                                    <button
                                      type="button"
                                      className="eqs-table-btn eqs-edit-btn"
                                      onClick={() => startEdit(item)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="eqs-table-btn eqs-delete-btn"
                                      onClick={() => handleDelete(item.id)}
                                      disabled={deletingId === item.id}
                                    >
                                      {deletingId === item.id
                                        ? "Deleting..."
                                        : "Delete"}
                                    </button>
                                  </>
                                ) : null}
                              </>
                            )}{" "}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
