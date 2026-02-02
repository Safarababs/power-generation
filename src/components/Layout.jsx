import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "./ThemeContext";

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    // On desktop, toggle collapsed
    if (window.innerWidth > 768) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // On mobile, toggle open/closed
      setSidebarOpen(!sidebarOpen);
    }
    console.log(darkMode);
  };

  return (
    <div className="app">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
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
