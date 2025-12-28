import React from 'react';
import { useTheme } from './ThemeContext';
import { FaBell, FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={toggleSidebar}
          className="header-button"
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold hidden md:block">Power Generation Control</h1>
      </div>
      
      <div className="header-right">
        <div className="relative">
          <button className="header-button">
            <FaBell size={20} />
            <span className="notification-badge"></span>
          </button>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="header-button"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        
        <div className="user-avatar">
          OP
        </div>
      </div>
    </header>
  );
};

export default Header;