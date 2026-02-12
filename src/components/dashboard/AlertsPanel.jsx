import React from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";

const AlertIcon = ({ type }) => {
  switch (type) {
    case "critical":
      return <FaExclamationTriangle size={16} style={{ color: "#ef4444" }} />;
    case "warning":
      return <FaExclamationTriangle size={16} style={{ color: "#f59e0b" }} />;
    case "info":
      return <FaInfoCircle size={16} style={{ color: "#3b82f6" }} />;
    case "success":
      return <FaCheckCircle size={16} style={{ color: "#10b981" }} />;
    default:
      return <FaInfoCircle size={16} style={{ color: "#6b7280" }} />;
  }
};

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: "critical",
      message: "Generator #3 temperature exceeding threshold",
      time: "5m ago",
    },
    {
      id: 2,
      type: "warning",
      message: "Substation voltage fluctuation detected",
      time: "15m ago",
    },
    {
      id: 3,
      type: "info",
      message: "Scheduled maintenance for Turbine #5",
      time: "1h ago",
    },
    {
      id: 4,
      type: "success",
      message: "Grid synchronization completed successfully",
      time: "2h ago",
    },
  ];

  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Alerts & Notifications</h2>
          <span className="status-critical">1 Critical</span>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-color)" }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 flex items-start ${
              alert.type === "critical" ? "alert-danger" : ""
            }`}
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div className="mr-3 mt-1">
              <AlertIcon type={alert.type} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="flex items-center mt-1 text-xs text-secondary">
                <FaClock size={12} className="mr-1" />
                <span>{alert.time}</span>
              </div>
            </div>
            <button className="p-1 text-secondary hover:text-primary">
              <FaTimes size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 text-center">
        <button className=" btn-primary">View all notifications</button>
      </div>
    </div>
  );
};

export default AlertsPanel;
