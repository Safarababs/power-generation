import React, { useEffect, useState } from "react";
import { db } from "../../FIrestore/firebase";
import {
  collection,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const AlertsApproval = ({ currentUser }) => {
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const [editValues, setEditValues] = useState({
    area: "",
    description: "",
    type: "critical",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
      const alerts = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data.approved) {
          alerts.push({ id: docSnap.id, ...data });
        }
      });
      setPendingAlerts(alerts);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  const approveAlert = async (alertId) => {
    if (currentUser?.department !== "manager-operation") {
      alert("Only Manager-Operation can approve alerts.");
      return;
    }

    await updateDoc(doc(db, "alerts", alertId), { approved: true });
    setPendingAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    alert("Alert approved!");
  };

  const startEditing = (alert) => {
    setEditingAlert(alert.id);
    setEditValues({
      area: alert.area,
      description: alert.description,
      type: alert.type,
    });
  };

  const saveEdit = async (alertId) => {
    if (currentUser?.department !== "manager-operation") {
      alert("Only Manager-Operation can edit alerts.");
      return;
    }

    await updateDoc(doc(db, "alerts", alertId), {
      area: editValues.area,
      description: editValues.description,
      type: editValues.type,
    });

    setPendingAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, ...editValues } : alert,
      ),
    );

    setEditingAlert(null);
    alert("Alert updated!");
  };

  const deleteAlert = async (alertId) => {
    if (currentUser?.department !== "manager-operation") {
      alert("Only Manager-Operation can delete alerts.");
      return;
    }

    await deleteDoc(doc(db, "alerts", alertId));
    setPendingAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    alert("Alert deleted!");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title mb-4">Pending Alerts</h2>
        <p className="text-sm text-secondary">
          Review and approve pending alerts.
        </p>
      </div>
      <div className="card-content">
        <div className="overflow-x-auto">
          {pendingAlerts.length === 0 ? (
            <p>No pending alerts 🎉</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Created At</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      {editingAlert === alert.id ? (
                        <input
                          value={editValues.area}
                          className="form-input"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              area: e.target.value,
                            })
                          }
                        />
                      ) : (
                        alert.area
                      )}
                    </td>
                    <td>
                      {editingAlert === alert.id ? (
                        <textarea
                          className="form-input"
                          value={editValues.description}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        alert.description
                      )}
                    </td>
                    <td>
                      {editingAlert === alert.id ? (
                        <select
                          className="form-select"
                          value={editValues.type}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="critical">Critical</option>
                          <option value="non-critical">Non-Critical</option>
                          <option value="info">Information Only</option>
                        </select>
                      ) : (
                        alert.type
                      )}
                    </td>
                    <td>
                      {alert.createdAt?.toDate
                        ? alert.createdAt.toDate().toLocaleString()
                        : "—"}
                    </td>
                    {alert.createdBy?.name || alert.createdBy?.email || "—"}

                    <td>
                      {editingAlert === alert.id ? (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => saveEdit(alert.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingAlert(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning m-1"
                            onClick={() => startEditing(alert)}
                            disabled={
                              currentUser?.department !== "manager-operation"
                            }
                          >
                            Edit
                          </button>
                          <button
                            className={`btn ${
                              currentUser?.department === "manager-operation"
                                ? "btn-success m-1"
                                : "btn-disabled m-1"
                            }`}
                            onClick={() => approveAlert(alert.id)}
                            disabled={
                              currentUser?.department !== "manager-operation"
                            }
                          >
                            Approve
                          </button>
                          <button
                            className={`btn ${
                              currentUser?.department === "manager-operation"
                                ? "btn-danger m-1"
                                : "btn-disabled m-1"
                            }`}
                            onClick={() => deleteAlert(alert.id)}
                            disabled={
                              currentUser?.department !== "manager-operation"
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsApproval;
