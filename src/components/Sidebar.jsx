import React, { useState } from "react";
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
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";

const Sidebar = ({ collapsed, mobileOpen, closeSidebar, currentUser }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Base groups
  const groupedNavItems = [
    {
      group: "Operations Hub",
      icon: <FaBolt size={16} />,
      items: [
        { icon: <FaHome size={20} />, label: "Dashboard", path: "/" },
        {
          icon: <FaBolt size={20} />,
          label: "Generation",
          path: "/generation",
        },
        {
          icon: <FaTachometerAlt size={20} />,
          label: "Monitoring",
          path: "/DashboardLayout",
        },
        { icon: <FaSliders size={20} />, label: "Controls", path: "/controls" },
      ],
    },
    {
      group: "Data Input",
      icon: <FaGasPump size={16} />,
      items: [
        {
          icon: <FaTachometerAlt size={20} />,
          label: "Start/Stop Logs",
          path: "/start-stop-logs",
        },
        // alerts need approval only for manager and above
        {
          icon: <FaTachometerAlt size={20} />,
          label: "Plant Alerts",
          path: "/alerts",
        },
        {
          icon: <FaTachometerAlt size={20} />,
          label: "Monthly Start/Stop",
          path: "/monthly-starts-stops",
        },
        {
          icon: <FaTachometerAlt size={20} />,
          label: "Readings",
          path: "/readings",
        },
        {
          icon: <FaGasPump size={20} />,
          label: "Fuel Reading",
          path: "/fuel-readings",
        },
        {
          icon: <FaGasPump size={20} />,
          label: "Mills Tripping Record",
          path: "/mills-tripping-record",
        },
        {
          icon: <FaGasPump size={20} />,
          label: "Wash Log",
          path: "/wash-logs",
        },
      ],
    },
    {
      group: "Knowledge Hub",
      icon: <FaClipboardList size={16} />,
      items: [
        { icon: <FaClipboardList size={20} />, label: "SOP's", path: "/sop" },
        {
          icon: <FaFileAlt size={20} />,
          label: "Protections",
          path: "/engines-safety",
        },
      ],
    },
    {
      group: "Miscellaneous",
      icon: <FaClipboardList size={16} />,
      items: [
        { icon: <FaFileAlt size={20} />, label: "Reports", path: "/reports" },
        {
          icon: <FaChartLine size={20} />,
          label: "Analytics",
          path: "/analytics",
        },
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Alerts",
          path: "/alerts",
        },
      ],
    },
    {
      group: "Team & Settings",
      icon: <FaUsers size={16} />,
      items: [
        {
          icon: <FaUsers size={20} />,
          label: "Attendance",
          path: "/attendance",
        },
        { icon: <FaUsers size={20} />, label: "Team", path: "/team" },
        { icon: <FaCog size={20} />, label: "Settings", path: "/settings" },
      ],
    },
  ];

  // Add Developer Tools only if user is developer
  if (currentUser?.department === "developer") {
    groupedNavItems.push({
      group: "Developer Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCog size={20} />,
          label: "Approval Dashboard",
          path: "/approval-dashboard",
        },
      ],
    });
  }
  if (currentUser?.department === "manager-operation") {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Alerts Approval",
          path: "/alerts-approval",
        },
      ],
    });
  }

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
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
          {groupedNavItems.map((group, gIndex) => (
            <li key={gIndex} className="sidebar-group">
              <button
                className={`group-toggle ${collapsed ? "justify-center" : ""}`}
                onClick={() => toggleGroup(group.group)}
              >
                <span className="group-icon">{group.icon}</span>
                {!collapsed && (
                  <span className="font-semibold ml-2">{group.group}</span>
                )}
                <span className="ml-auto">
                  {openGroups[group.group] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </button>
              {openGroups[group.group] && (
                <ul className="submenu">
                  {group.items.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={closeSidebar}
                          className={`${isActive ? "active" : ""} ${collapsed ? "justify-center" : ""}`}
                        >
                          <span>{item.icon}</span>
                          {!collapsed && (
                            <span className="ml-2">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
