import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaExclamationTriangle,
  FaChartLine,
  FaFileAlt,
  FaUsers,
  FaBolt,
  FaTachometerAlt,
  FaClipboardList,
  FaGasPump,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const navItems = [
    { icon: <FaHome size={20} />, label: "Dashboard", path: "/" },
    {
      icon: <FaChartLine size={20} />,
      label: "Feeders Tripping",
      path: "/feeders",
    },
    { icon: <FaBolt size={20} />, label: "Generation", path: "/generation" },
    { icon: <FaSliders size={20} />, label: "Controls", path: "/controls" },
    { icon: <FaClipboardList size={20} />, label: "SOP's", path: "/sop" }, // ✅ checklist for procedures
    { icon: <FaChartLine size={20} />, label: "Analytics", path: "/analytics" }, // ✅ line chart for trends
    {
      icon: <FaExclamationTriangle size={20} />,
      label: "Alerts",
      path: "/alerts",
    },
    { icon: <FaFileAlt size={20} />, label: "Reports", path: "/reports" },
    { icon: <FaUsers size={20} />, label: "Team", path: "/team" },
    {
      icon: <FaTachometerAlt size={20} />,
      label: "Readings",
      path: "/readings",
    }, // ✅ gauge for readings
    {
      icon: <FaGasPump size={20} />,
      label: "Fuel Reading",
      path: "/fuel-readings",
    }, // ✅ gas pump for fuel
    { icon: <FaCog size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FaBolt size={18} />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg">NAS PG Samawa</span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`${isActive ? "active" : ""} ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
