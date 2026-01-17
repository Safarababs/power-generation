import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { auth } from "./FIrestore/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthModal from "./Users/AuthModel";

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Track auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

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
        <h1 className="text-xl font-semibold hidden md:block">
          Power Generation Control
        </h1>
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
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Avatar / Login */}
        <div className="user-avatar cursor-pointer">
          {user ? (
            <div onClick={handleLogout}>
              {user.displayName
                ? user.displayName[0].toUpperCase()
                : user.email[0].toUpperCase()}
            </div>
          ) : (
            <div onClick={() => setShowAuthModal(true)}>Login</div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
};

export default Header;
