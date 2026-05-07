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
  FaCogs,
  FaPlug,
  FaPlay,
  FaCalendarAlt,
  FaBook,
  FaShieldAlt,
  FaBell,
  FaUserCheck,
  FaCheckCircle,
  FaHourglassHalf,
  FaClipboardCheck,
  FaSlidersH,
  FaExclamationCircle,
  FaIndustry,
  FaFileSignature,
  FaWater,
} from "react-icons/fa";

const Sidebar = ({ collapsed, mobileOpen, closeSidebar, currentUser }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Base groups
  let groupedNavItems = [
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
        {
          icon: <FaChartLine size={20} />,
          label: "Equipment's Status",
          path: "/equipment-dashboard",
        },
        {
          icon: <FaCogs size={20} />,
          label: "Engine's Record",
          path: "/enginelogtable",
        },
        {
          icon: <FaPlug size={20} />,
          label: "Feeders Executive Summary",
          path: "/feedersummaryexecutive",
        },
        {
          icon: <FaPlug size={20} />,
          label: "Feeders Tripping record",
          path: "/millstripping",
        },
      ],
    },
    {
      group: "Data Input",
      icon: <FaGasPump size={16} />,
      items: [
        {
          icon: <FaPlay size={20} />,
          label: "Start/Stop Logs",
          path: "/start-stop-logs",
        },
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Plant Alerts",
          path: "/alerts",
        },
        {
          icon: <FaCalendarAlt size={20} />,
          label: "Monthly Start/Stop",
          path: "/monthly-starts-stops",
        },
        {
          icon: <FaClipboardList size={20} />,
          label: "Readings",
          path: "/readings",
        },
        {
          icon: <FaGasPump size={20} />,
          label: "Fuel Reading",
          path: "/fuel-readings",
        },
        {
          icon: <FaIndustry size={20} />,
          label: "Mills Tripping Record",
          path: "/mills-tripping-record",
        },
        {
          icon: <FaFileSignature size={20} />,
          label: "Add Sop's",
          path: "/addsop",
        },
        { icon: <FaWater size={20} />, label: "Wash Log", path: "/wash-logs" },
      ],
    },
    {
      group: "Knowledge Hub",
      icon: <FaClipboardList size={16} />,
      items: [
        { icon: <FaBook size={20} />, label: "SOP's", path: "/sop" },
        {
          icon: <FaShieldAlt size={20} />,
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
        { icon: <FaBell size={20} />, label: "Alerts", path: "/alerts" },
      ],
    },
    {
      group: "Team & Settings",
      icon: <FaUsers size={16} />,
      items: [
        {
          icon: <FaUserCheck size={20} />,
          label: "Attendance",
          path: "/attendance",
        },
        { icon: <FaUsers size={20} />, label: "Team", path: "/team" },
        { icon: <FaCog size={20} />, label: "Settings", path: "/settings" },
      ],
    },
  ];

  // Conditional groups based on user role
  if (
    currentUser?.department === "operation" &&
    currentUser.designation === "developer"
  ) {
    groupedNavItems.push({
      group: "Developer Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCheckCircle size={20} />,
          label: "Approval Dashboard",
          path: "/approval-dashboard",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "DGR Monthly View",
          path: "/MonthlyDGR",
        },

        {
          icon: <FaFileSignature size={20} />,
          label: "Monthly DGR Entry",
          path: "/monthly-dgr-form",
        },
        {
          icon: <FaBell size={20} />,
          label: "Tanks Dip",
          path: "/tanks-dip",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "Equipment Summary",
          path: "/equipment-summary",
        },
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Equipement Status Form",
          path: "/equipment-status",
        },
        // equipment status dashboard
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Equipment Status",
          path: "/equipment-dashboard",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "DATA Download",
          path: "/data-download",
        },
        // json handling
        {
          icon: <FaExclamationCircle size={20} />,
          label: "Mill Records JSON",
          path: "/mill-records-json",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "handled Mill Records JSON",
          path: "/mill-records-json-after-handling",
        },
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
        {
          icon: <FaClipboardCheck size={20} />,
          label: "Approval SOP's",
          path: "/apprvelabsop",
        },
        {
          icon: <FaSlidersH size={20} />,
          label: "Parameter Analyse",
          path: "/parameteranalyse",
        },
      ],
    });
  }

  if (
    currentUser?.department === "services" &&
    currentUser.designation === "STORE In-Charge"
  ) {
    groupedNavItems = [
      {
        group: "Services Dashboard",
        icon: <FaPlug size={16} />,
        items: [
          {
            icon: <FaBolt size={20} />,
            label: "Overview",
            path: "/electrical-Dashboard",
          },
          // {
          //   icon: <FaBolt size={20} />,
          //   label: "Load Distribution",
          //   path: "/executive/electrical-load",
          // },
          // {
          //   icon: <FaExclamationTriangle size={20} />,
          //   label: "Relay Trips",
          //   path: "/executive/electrical-trips",
          // },
        ],
      },
      {
        group: "Store Admin Tools",
        icon: <FaCog size={16} />,
        items: [
          {
            icon: <FaHourglassHalf size={20} />,
            label: "Pending Sop's",
            path: "/pendingsop",
          },
          {
            icon: <FaClipboardCheck size={20} />,
            label: "Approval SOP's",
            path: "/apprvelabsop",
          },
        ],
      },
    ];
  }

  // General Manager view

  if (
    currentUser?.department === "executive" &&
    currentUser?.designation === "General Manager"
  ) {
    groupedNavItems = [
      {
        group: "Operations Dashboard",
        icon: <FaBolt size={16} />,
        items: [
          {
            icon: <FaHome size={20} />,
            label: "Overview",
            path: "/",
          },
          {
            icon: <FaExclamationCircle size={20} />,
            label: "Equipment Summary",
            path: "/equipment-summary",
          },
          {
            icon: <FaExclamationCircle size={20} />,
            label: "DGR Monthly View",
            path: "/MonthlyDGR",
          },

          {
            icon: <FaPlug size={20} />,
            label: "Feeders Executive Summary",
            path: "/feedersummaryexecutive",
          },
          {
            icon: <FaChartLine size={20} />,
            label: "Generation",
            path: "/generation",
          },
          {
            icon: <FaTachometerAlt size={20} />,
            label: "Monitoring",
            path: "/DashboardLayout",
          },

          {
            icon: <FaCogs size={20} />,
            label: "Parameters Summary",
            path: "/summery",
          },

          {
            icon: <FaCogs size={20} />,
            label: "Engine's Record",
            path: "/enginelogtable",
          },
          {
            icon: <FaPlug size={20} />,
            label: "Feeders Tripping record",
            path: "/millstripping",
          },
        ],
      },
      {
        group: "Mechanical Dashboard",
        icon: <FaCogs size={16} />,
        items: [
          {
            icon: <FaClipboardList size={20} />,
            label: "Overview",
            path: "/mechanical-Dashboard",
          },
          // {
          //   icon: <FaIndustry size={20} />,
          //   label: "Equipment Health",
          //   path: "/executive/mechanical-health",
          // },
          // {
          //   icon: <FaClipboardList size={20} />,
          //   label: "Maintenance Logs",
          //   path: "/executive/mechanical-maintenance",
          // },
        ],
      },
      {
        group: "Electrical Dashboard",
        icon: <FaPlug size={16} />,
        items: [
          {
            icon: <FaBolt size={20} />,
            label: "Overview",
            path: "/electrical-Dashboard",
          },
          // {
          //   icon: <FaBolt size={20} />,
          //   label: "Load Distribution",
          //   path: "/executive/electrical-load",
          // },
          // {
          //   icon: <FaExclamationTriangle size={20} />,
          //   label: "Relay Trips",
          //   path: "/executive/electrical-trips",
          // },
        ],
      },
      {
        group: "Utility Dashboard",
        icon: <FaGasPump size={16} />,
        items: [
          {
            icon: <FaWater size={20} />,
            label: "Overview",
            path: "/utility-dashboard",
          },
          // {
          //   icon: <FaWater size={20} />,
          //   label: "Water Usage",
          //   path: "/executive/utility-water",
          // },
          // {
          //   icon: <FaGasPump size={20} />,
          //   label: "Fuel Consumption",
          //   path: "/executive/utility-fuel",
          // },
        ],
      },
      {
        group: "Services Dashboard",
        icon: <FaUsers size={16} />,
        items: [
          {
            icon: <FaUserCheck size={20} />,
            label: "Overview",
            path: "/services-Dashboard",
          },
          {
            icon: <FaUserCheck size={20} />,
            label: "HR Attandance",
            path: "/services-Dashboard",
          },
          //   {
          //     icon: <FaClipboardList size={20} />,
          //     label: "Procurement",
          //     path: "/executive/services-procurement",
          //   },
        ],
      },
      {
        group: "Knowledge Hub",
        icon: <FaClipboardList size={16} />,
        items: [
          { icon: <FaBook size={20} />, label: "SOP's", path: "/sop" },
          {
            icon: <FaShieldAlt size={20} />,
            label: "Protections",
            path: "/engines-safety",
          },
          {
            icon: <FaShieldAlt size={20} />,
            label: "Video Lectures",
            path: "/videoslectures",
          },
        ],
      },
    ];
  }

  // General Manager view end

  if (currentUser?.department === "uty" && currentUser.designation === "QCO") {
    groupedNavItems.push({
      group: "Manager QC Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
      ],
    });
  }

  if (
    currentUser?.department === "uty" &&
    currentUser.designation === "Deputy Manager Utilities"
  ) {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCheckCircle size={20} />,
          label: "Approval Dashboard",
          path: "/apprvelabsop",
        },
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
      ],
    });
  }

  // manager Mechanical view start
  if (
    currentUser?.department === "mechanical" &&
    currentUser.designation === "MM"
  ) {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCheckCircle size={20} />,
          label: "Approval Dashboard",
          path: "/apprvelabsop",
        },
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
      ],
    });
  }

  // manager Mechanical view end

  // Deputy manager Mechanical view start
  if (
    currentUser?.department === "mechanical" &&
    currentUser.designation === "Sr Shift Incharge"
  ) {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
      ],
    });
  }

  // Deputy manager Mechanical view end

  if (
    currentUser?.department === "uty" &&
    currentUser.designation === "Officer"
  ) {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCheckCircle size={20} />,
          label: "Approval Dashboard",
          path: "/apprvelabsop",
        },
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending Sop's",
          path: "/pendingsop",
        },
      ],
    });
  }

  if (
    currentUser?.department === "operation" &&
    currentUser?.designation === "MO"
  ) {
    groupedNavItems.push({
      group: "Manager Tools",
      icon: <FaCog size={16} />,
      items: [
        {
          icon: <FaCheckCircle size={20} />,
          label: "Equipment Status",
          path: "/equipment-dashboard",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "DGR Monthly View",
          path: "/MonthlyDGR",
        },
        {
          icon: <FaCheckCircle size={20} />,
          label: "Equipment Summary",
          path: "/equipment-summary",
        },
        {
          icon: <FaExclamationTriangle size={20} />,
          label: "Equipement Status Form",
          path: "/equipment-status",
        },
        {
          icon: <FaExclamationCircle size={20} />,
          label: "Alerts Approval",
          path: "/alerts-approval",
        },
        {
          icon: <FaHourglassHalf size={20} />,
          label: "Pending SOP's",
          path: "/pendingsop",
        },
        {
          icon: <FaCheckCircle size={20} />,
          label: "Approval Dashboard",
          path: "/apprvelabsop",
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
          {!collapsed && <span className="font-bold text-lg">NAS PG-IPS</span>}
        </div>
      </div>

      {/* Scrollable nav */}
      <nav className="sidebar-nav overflow-y-auto">
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
