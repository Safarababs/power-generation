import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  FaBolt,
  FaSlidersH,
  FaSync,
  FaExclamationTriangle,
  FaPlay,
  FaPause,
  FaCog,
} from "react-icons/fa";

const Controls = () => {
  const { generators, updateGenerator, addAlert } = useData();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [loadBalanceMode, setLoadBalanceMode] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState(null);

  const handleEmergencyStop = () => {
    setEmergencyMode(true);
    generators.forEach((gen) => {
      if (gen.status === "online") {
        updateGenerator(gen.id, {
          status: "offline",
          output: 0,
          temperature: 25,
        });
      }
    });
    addAlert({
      type: "critical",
      message: "Emergency stop activated - All generators shut down",
      time: "Now",
      acknowledged: false,
    });
    setTimeout(() => setEmergencyMode(false), 5000);
  };

  const handleLoadBalance = () => {
    setLoadBalanceMode(true);
    const onlineGenerators = generators.filter((g) => g.status === "online");
    const currentLoad = onlineGenerators.reduce((sum, g) => sum + g.output, 0);

    onlineGenerators.forEach((gen) => {
      const optimalOutput = currentLoad / onlineGenerators.length;
      updateGenerator(gen.id, {
        output: Math.min(optimalOutput, gen.capacity * 0.9),
      });
    });

    addAlert({
      type: "success",
      message: "Load balancing completed successfully",
      time: "Now",
      acknowledged: false,
    });
    setTimeout(() => setLoadBalanceMode(false), 3000);
  };

  const handleOutputAdjustment = (generatorId, newOutput) => {
    const generator = generators.find((g) => g.id === generatorId);
    if (generator && generator.status === "online") {
      updateGenerator(generatorId, {
        output: Math.max(0, Math.min(newOutput, generator.capacity)),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Controls</h1>
        <div className="flex items-center space-x-4">
          <div
            className={`status-badge ${
              emergencyMode ? "status-critical" : "status-online"
            }`}
          >
            {emergencyMode ? "Emergency Mode" : "Normal Operation"}
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="card">
        <div className="card-content">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaExclamationTriangle
              size={20}
              style={{ color: "#ef4444", marginRight: "0.5rem" }}
            />
            Emergency Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleEmergencyStop}
              disabled={emergencyMode}
              className="btn btn-danger"
              style={{
                opacity: emergencyMode ? 0.5 : 1,
                cursor: emergencyMode ? "not-allowed" : "pointer",
              }}
            >
              <FaBolt size={20} className="btn-icon" />
              Emergency Stop All
            </button>

            <button
              onClick={handleLoadBalance}
              disabled={loadBalanceMode}
              className="btn btn-primary"
              style={{
                opacity: loadBalanceMode ? 0.5 : 1,
                cursor: loadBalanceMode ? "not-allowed" : "pointer",
              }}
            >
              <FaSlidersH size={20} className="btn-icon" />
              {loadBalanceMode ? "Balancing..." : "Load Balance"}
            </button>

            <button className="btn btn-warning">
              <FaSync size={20} className="btn-icon" />
              System Reset
            </button>
          </div>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Individual Generator Controls</h2>
        </div>
        <div className="card-content">
          <div className="space-y-6">
            {generators.map((generator) => (
              <div key={generator.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold">{generator.name}</h3>
                    <span
                      className={`status-badge ${
                        generator.status === "online"
                          ? "status-online"
                          : generator.status === "offline"
                          ? "status-offline"
                          : generator.status === "maintenance"
                          ? "status-maintenance"
                          : "status-warning"
                      }`}
                    >
                      {generator.status.charAt(0).toUpperCase() +
                        generator.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setSelectedGenerator(
                          selectedGenerator === generator.id
                            ? null
                            : generator.id
                        )
                      }
                      className="btn"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    >
                      <FaCog size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      Current Output
                    </label>
                    <div className="text-lg font-semibold">
                      {generator.output} MW
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      Capacity
                    </label>
                    <div className="text-lg font-semibold">
                      {generator.capacity} MW
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      Temperature
                    </label>
                    <div
                      className={`text-lg font-semibold`}
                      style={{
                        color:
                          generator.temperature > 90
                            ? "#ef4444"
                            : generator.temperature > 85
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    >
                      {generator.temperature}°C
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      Efficiency
                    </label>
                    <div className="text-lg font-semibold">
                      {generator.efficiency}%
                    </div>
                  </div>
                </div>

                {generator.status === "online" && (
                  <div className="mb-4">
                    <label className="block text-sm text-secondary mb-2">
                      Output Control: {generator.output} MW
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={generator.capacity}
                      step="0.1"
                      value={generator.output}
                      onChange={(e) =>
                        handleOutputAdjustment(
                          generator.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full"
                      style={{
                        height: "0.5rem",
                        borderRadius: "9999px",
                        background: "var(--border-color)",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex justify-between text-xs text-secondary mt-1">
                      <span>0 MW</span>
                      <span>{generator.capacity} MW</span>
                    </div>
                  </div>
                )}

                {selectedGenerator === generator.id && (
                  <div
                    className="mt-4 p-4 rounded-lg"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  >
                    <h4 className="font-semibold mb-3">Advanced Controls</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Ramp Rate (MW/min)</label>
                        <input
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          defaultValue="2.5"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          Target Temperature (°C)
                        </label>
                        <input
                          type="number"
                          min="70"
                          max="95"
                          defaultValue="85"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          Voltage Setpoint (V)
                        </label>
                        <input
                          type="number"
                          min="220"
                          max="240"
                          defaultValue="230"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Frequency (Hz)</label>
                        <input
                          type="number"
                          min="49"
                          max="51"
                          step="0.01"
                          defaultValue="50.00"
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button className="btn btn-primary">
                        Apply Settings
                      </button>
                      <button
                        className="btn"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {generator.status === "offline" && (
                    <button
                      onClick={() =>
                        updateGenerator(generator.id, {
                          status: "online",
                          output: generator.capacity * 0.7,
                          temperature: 80,
                        })
                      }
                      className="btn btn-success"
                    >
                      <FaPlay size={16} className="btn-icon" />
                      Start
                    </button>
                  )}
                  {generator.status === "online" && (
                    <button
                      onClick={() =>
                        updateGenerator(generator.id, {
                          status: "offline",
                          output: 0,
                          temperature: 25,
                        })
                      }
                      className="btn btn-danger"
                    >
                      <FaPause size={16} className="btn-icon" />
                      Stop
                    </button>
                  )}
                  <button
                    onClick={() =>
                      updateGenerator(generator.id, {
                        status: "maintenance",
                        output: 0,
                        temperature: 25,
                      })
                    }
                    className="btn btn-primary"
                  >
                    <FaSync size={16} className="btn-icon" />
                    Maintenance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
