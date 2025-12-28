import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { FaBolt, FaPlay, FaPause, FaSync, FaCog } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const Generation = () => {
  const { generators, updateGenerator, addAlert } = useData();
  const [selectedGenerator, setSelectedGenerator] = useState(null);

  const handleGeneratorAction = (id, action) => {
    const generator = generators.find((g) => g.id === id);
    if (!generator) return;

    switch (action) {
      case "start":
        if (generator.status === "offline") {
          updateGenerator(id, {
            status: "online",
            output: generator.capacity * 0.7,
            temperature: 80,
          });
          addAlert({
            type: "success",
            message: `${generator.name} started successfully`,
            time: "Now",
            acknowledged: false,
            generator: generator.name,
          });
        }
        break;
      case "stop":
        if (generator.status === "online") {
          updateGenerator(id, {
            status: "offline",
            output: 0,
            temperature: 25,
          });
          addAlert({
            type: "info",
            message: `${generator.name} stopped`,
            time: "Now",
            acknowledged: false,
            generator: generator.name,
          });
        }
        break;
      case "maintenance":
        updateGenerator(id, {
          status: "maintenance",
          output: 0,
          temperature: 25,
        });
        addAlert({
          type: "info",
          message: `${generator.name} entered maintenance mode`,
          time: "Now",
          acknowledged: false,
          generator: generator.name,
        });
        break;
      default:
        console.warn(`Unhandled action type: ${action}`);
        break;
    }
  };

  const getStatusClass = (status) => {
    console.log(selectedGenerator);
    switch (status) {
      case "online":
        return "status-online";
      case "offline":
        return "status-offline";
      case "maintenance":
        return "status-maintenance";
      case "warning":
        return "status-warning";
      default:
        return "status-offline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Power Generation Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-secondary">
            Total Output:{" "}
            <span className="font-semibold text-lg">
              {generators.reduce((sum, g) => sum + g.output, 0).toFixed(1)} MW
            </span>
          </div>
        </div>
      </div>

      {/* Generation Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Active Generators</p>
                <p className="text-2xl font-bold">
                  {generators.filter((g) => g.status === "online").length}
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <FaBolt size={24} style={{ color: "#10b981" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <FaArrowTrendUp
                size={16}
                style={{ color: "#10b981", marginRight: "0.25rem" }}
              />
              <span style={{ color: "#10b981" }}>+2 from yesterday</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Capacity Utilization</p>
                <p className="text-2xl font-bold">
                  {(
                    (generators.reduce((sum, g) => sum + g.output, 0) /
                      generators.reduce((sum, g) => sum + g.capacity, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <FaArrowTrendUp size={24} style={{ color: "#3b82f6" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <FaArrowTrendDown
                size={16}
                style={{ color: "#ef4444", marginRight: "0.25rem" }}
              />
              <span style={{ color: "#ef4444" }}>-1.2% from last hour</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Maintenance Due</p>
                <p className="text-2xl font-bold">
                  {
                    generators.filter((g) => parseInt(g.nextMaintenance) <= 7)
                      .length
                  }
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              >
                <FaSync size={24} style={{ color: "#f59e0b" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span style={{ color: "#f59e0b" }}>Within 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {generators.map((generator) => (
          <div key={generator.id} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{generator.name}</h3>
                <span
                  className={`status-badge ${getStatusClass(generator.status)}`}
                >
                  {generator.status.charAt(0).toUpperCase() +
                    generator.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Output</span>
                  <span className="font-semibold">{generator.output} MW</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        (generator.output / generator.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary">Temperature</span>
                    <p className="font-semibold">{generator.temperature}°C</p>
                  </div>
                  <div>
                    <span className="text-secondary">Efficiency</span>
                    <p className="font-semibold">{generator.efficiency}%</p>
                  </div>
                  <div>
                    <span className="text-secondary">Uptime</span>
                    <p className="font-semibold">{generator.uptime}</p>
                  </div>
                  <div>
                    <span className="text-secondary">Next Service</span>
                    <p className="font-semibold">{generator.nextMaintenance}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  {generator.status === "offline" && (
                    <button
                      onClick={() =>
                        handleGeneratorAction(generator.id, "start")
                      }
                      className="flex-1 btn btn-success"
                    >
                      <FaPlay size={16} className="btn-icon" />
                      Start
                    </button>
                  )}

                  {generator.status === "online" && (
                    <button
                      onClick={() =>
                        handleGeneratorAction(generator.id, "stop")
                      }
                      className="flex-1 btn btn-danger"
                    >
                      <FaPause size={16} className="btn-icon" />
                      Stop
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleGeneratorAction(generator.id, "maintenance")
                    }
                    className="flex-1 btn btn-primary"
                  >
                    <FaSync size={16} className="btn-icon" />
                    Maintain
                  </button>

                  <button
                    onClick={() => setSelectedGenerator(generator.id)}
                    className="btn"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                  >
                    <FaCog size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generation;
