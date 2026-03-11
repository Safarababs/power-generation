import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaPowerOff,
  FaSync,
  FaExclamationTriangle,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    {
      icon: <FaShieldAlt size={20} style={{ color: "#10b981" }} />,
      label: "System Check",
      description: "Run diagnostics",
      path: "/summery",
    },
    {
      icon: <FaPowerOff size={20} style={{ color: "#ef4444" }} />,
      label: "Emergency Stop",
      description: "All generators",
    },
    {
      icon: <FaSync size={20} style={{ color: "#3b82f6" }} />,
      label: "Load Balance",
      description: "Optimize output",
    },
    {
      icon: <FaExclamationTriangle size={20} style={{ color: "#f59e0b" }} />,
      label: "Reset Alerts",
      description: "Clear notifications",
    },
    {
      icon: <FaFileAlt size={20} style={{ color: "#8b5cf6" }} />,
      label: "Generate Report",
      description: "Daily summary",
    },
    {
      icon: <FaClock size={20} style={{ color: "#6366f1" }} />,
      label: "Schedule Task",
      description: "/readings",
    },
  ];

  return (
    <div className="card h-full">
      <div className="card-header">
        <h2 className="card-title">Quick Actions</h2>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg text-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              onClick={() => navigate(action.path)}
            >
              <div className="mb-2">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs text-secondary mt-1">
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
