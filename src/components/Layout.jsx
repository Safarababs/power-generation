import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "./ThemeContext";

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log(darkMode ? "Dark mode is enabled" : "Dark mode is disabled");
  };

  return (
    <div className="app">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`main-content ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
