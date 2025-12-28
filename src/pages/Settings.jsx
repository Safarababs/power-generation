import React, { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaWifi,
  FaDesktop,
  FaSave,
} from "react-icons/fa";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      criticalOnly: false,
    },
    system: {
      autoRefresh: true,
      refreshInterval: 5,
      dataRetention: 30,
      backupFrequency: "daily",
    },
    display: {
      theme: darkMode ? "dark" : "light",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
    },
    security: {
      sessionTimeout: 30,
      twoFactor: false,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <button onClick={handleSaveSettings} className="btn btn-primary">
          <FaSave size={16} className="btn-icon" />
          Save Changes
        </button>
      </div>

      {/* Notifications Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <FaBell size={20} className="mr-2" />
            Notification Settings
          </h2>
        </div>
        <div className="card-content space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Alert Channels</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "email",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "push",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">Push notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "sms",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">SMS notifications</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Alert Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.criticalOnly}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "criticalOnly",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">Critical alerts only</span>
                </label>
                <div>
                  <label className="form-label">
                    Quiet hours (no non-critical alerts)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="form-input"
                    />
                    <span className="self-center">to</span>
                    <input
                      type="time"
                      defaultValue="06:00"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <FaDatabase size={20} className="mr-2" />
            System Configuration
          </h2>
        </div>
        <div className="card-content space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={settings.system.autoRefresh}
                    onChange={(e) =>
                      handleSettingChange(
                        "system",
                        "autoRefresh",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">Auto-refresh data</span>
                </label>
                {settings.system.autoRefresh && (
                  <div>
                    <label className="form-label">
                      Refresh interval (seconds)
                    </label>
                    <select
                      value={settings.system.refreshInterval}
                      onChange={(e) =>
                        handleSettingChange(
                          "system",
                          "refreshInterval",
                          parseInt(e.target.value)
                        )
                      }
                      className="form-select"
                    >
                      <option value={1}>1 second</option>
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">
                  Data retention period (days)
                </label>
                <input
                  type="number"
                  value={settings.system.dataRetention}
                  onChange={(e) =>
                    handleSettingChange(
                      "system",
                      "dataRetention",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                  min="1"
                  max="365"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Backup frequency</label>
                <select
                  value={settings.system.backupFrequency}
                  onChange={(e) =>
                    handleSettingChange(
                      "system",
                      "backupFrequency",
                      e.target.value
                    )
                  }
                  className="form-select"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="form-label">System status</label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span className="text-sm">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <FaDesktop size={20} className="mr-2" />
            Display & Localization
          </h2>
        </div>
        <div className="card-content space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="form-label">Theme</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      checked={!darkMode}
                      onChange={() => !darkMode || toggleDarkMode()}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Light</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      checked={darkMode}
                      onChange={() => darkMode || toggleDarkMode()}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Dark</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">Language</label>
                <select
                  value={settings.display.language}
                  onChange={(e) =>
                    handleSettingChange("display", "language", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Timezone</label>
                <select
                  value={settings.display.timezone}
                  onChange={(e) =>
                    handleSettingChange("display", "timezone", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC</option>
                </select>
              </div>
              <div>
                <label className="form-label">Date format</label>
                <select
                  value={settings.display.dateFormat}
                  onChange={(e) =>
                    handleSettingChange("display", "dateFormat", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <FaShieldAlt size={20} className="mr-2" />
            Security & Access
          </h2>
        </div>
        <div className="card-content space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="form-label">Session timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                  min="5"
                  max="480"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "twoFactor",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">Enable two-factor authentication</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Password expiry (days)</label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "passwordExpiry",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                  min="30"
                  max="365"
                />
              </div>
              <div>
                <label className="form-label">Max login attempts</label>
                <input
                  type="number"
                  value={settings.security.loginAttempts}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "loginAttempts",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                  min="3"
                  max="10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <FaWifi size={20} className="mr-2" />
            Network & Connectivity
          </h2>
        </div>
        <div className="card-content space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="form-label">Primary server</label>
                <input
                  type="text"
                  defaultValue="192.168.1.100"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Backup server</label>
                <input
                  type="text"
                  defaultValue="192.168.1.101"
                  className="form-input"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Connection status</label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span className="text-sm">Connected</span>
                  <span className="text-xs text-secondary">
                    (Latency: 12ms)
                  </span>
                </div>
              </div>
              <div>
                <label className="form-label">Data sync interval</label>
                <select className="form-select">
                  <option>Real-time</option>
                  <option>Every 5 seconds</option>
                  <option>Every 30 seconds</option>
                  <option>Every minute</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
