import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  FaUsers,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

const Team = () => {
  const { users } = useData();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "senior operator":
        return { backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" };
      case "control engineer":
        return { backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" };
      case "maintenance tech":
        return { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "safety inspector":
        return { backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" };
      default:
        return {
          backgroundColor: "rgba(107, 114, 128, 0.1)",
          color: "#6b7280",
        };
    }
  };

  const getStatusColor = (status) => {
    return status === "online" ? "#10b981" : "#6b7280";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddUser(true)}
            className="btn btn-primary"
          >
            <FaUserPlus size={16} className="btn-icon" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Members</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <FaUsers size={32} style={{ color: "#3b82f6" }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Online Now</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.status === "online").length}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#10b981" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">On Shift</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <FaClock size={32} style={{ color: "#f59e0b" }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Departments</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <FaShieldAlt size={32} style={{ color: "#8b5cf6" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#3b82f6" }}
                    >
                      {user.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white`}
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <span
                      className="status-badge text-xs font-medium"
                      style={getRoleColor(user.role)}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-secondary">
                  <FaEnvelope size={16} className="mr-2" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center text-sm text-secondary">
                  <FaPhone size={16} className="mr-2" />
                  <span>
                    +1 (555) {Math.floor(Math.random() * 900 + 100)}-
                    {Math.floor(Math.random() * 9000 + 1000)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-secondary">
                  <FaClock size={16} className="mr-2" />
                  <span>Last active: {user.lastActive}</span>
                </div>

                <div className="flex items-center text-sm text-secondary">
                  <FaMapMarkerAlt size={16} className="mr-2" />
                  <span>Control Room {Math.floor(Math.random() * 3 + 1)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-secondary">Shift:</span>
                    <span className="ml-1 font-medium">Day (6AM - 6PM)</span>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedUser(selectedUser === user.id ? null : user.id)
                    }
                    className="text-blue hover:underline text-sm"
                  >
                    {selectedUser === user.id ? "Less" : "More"}
                  </button>
                </div>

                {selectedUser === user.id && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-secondary">Employee ID:</span>
                        <p className="font-medium">
                          EMP{user.id.toString().padStart(4, "0")}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary">Department:</span>
                        <p className="font-medium">Operations</p>
                      </div>
                      <div>
                        <span className="text-secondary">Hire Date:</span>
                        <p className="font-medium">Jan 15, 2020</p>
                      </div>
                      <div>
                        <span className="text-secondary">Clearance:</span>
                        <p className="font-medium">
                          Level {Math.floor(Math.random() * 3 + 2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-secondary">Certifications:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="status-badge status-online text-xs">
                          Power Systems
                        </span>
                        <span className="status-badge status-maintenance text-xs">
                          Safety Level 3
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 btn btn-primary">
                        Message
                      </button>
                      <button
                        className="flex-1 btn"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shift Schedule */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Current Shift Schedule</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#3b82f6" }}
                ></div>
                Day Shift (6AM - 6PM)
              </h3>
              <div className="space-y-2">
                {users
                  .filter((u) => u.status === "online")
                  .slice(0, 2)
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: "#3b82f6" }}
                      >
                        {user.avatar}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#f59e0b" }}
                ></div>
                Evening Shift (6PM - 2AM)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#f59e0b" }}
                  >
                    AB
                  </div>
                  <span className="text-sm">Alex Brown</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#f59e0b" }}
                  >
                    KW
                  </div>
                  <span className="text-sm">Kate Wilson</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#8b5cf6" }}
                ></div>
                Night Shift (2AM - 6AM)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#8b5cf6" }}
                  >
                    RT
                  </div>
                  <span className="text-sm">Robert Taylor</span>
                </div>
                <div className="text-sm text-secondary">
                  + 1 on-call technician
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md">
            <div className="card-content">
              <h3 className="text-lg font-semibold mb-4">
                Add New Team Member
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option>Senior Operator</option>
                    <option>Control Engineer</option>
                    <option>Maintenance Tech</option>
                    <option>Safety Inspector</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 btn border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn"
                    style={{ backgroundColor: "#3b82f6", color: "white" }}
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
