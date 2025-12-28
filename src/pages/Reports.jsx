import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaChartBar,
  FaPrint,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

const Reports = () => {
  const { generators } = useData();
  const [selectedReport, setSelectedReport] = useState("daily");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const reportTypes = [
    {
      id: "daily",
      name: "Daily Operations Report",
      description: "Comprehensive daily performance summary",
      icon: <FaFileAlt size={20} style={{ color: "#3b82f6" }} />,
    },
    {
      id: "weekly",
      name: "Weekly Performance Report",
      description: "Weekly trends and efficiency analysis",
      icon: <FaChartBar size={20} style={{ color: "#10b981" }} />,
    },
    {
      id: "monthly",
      name: "Monthly Summary Report",
      description: "Monthly operational statistics and insights",
      icon: <FaArrowTrendUp size={20} style={{ color: "#8b5cf6" }} />,
    },
    {
      id: "custom",
      name: "Custom Date Range Report",
      description: "Generate report for specific date range",
      icon: <FaCalendarAlt size={20} style={{ color: "#f59e0b" }} />,
    },
  ];

  const generateSampleData = () => {
    return {
      totalGeneration: 12450,
      averageEfficiency: 84.7,
      totalFuelConsumption: 2840,
      uptime: 98.5,
      peakDemand: 485.2,
      incidents: 3,
      maintenanceHours: 24,
      costPerMWh: 45.3,
    };
  };

  const sampleData = generateSampleData();

  const handleGenerateReport = () => {
    alert(
      `Generating ${reportTypes.find((r) => r.id === selectedReport)?.name}...`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <button onClick={handleGenerateReport} className="btn btn-primary">
            <FaDownload size={16} className="btn-icon" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`card p-6 border-2 text-left ${
              selectedReport === report.id
                ? "border-blue"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <div className="flex items-center mb-3">
              {report.icon}
              <h3 className="ml-3 font-semibold">{report.name}</h3>
            </div>
            <p className="text-sm text-secondary">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Date Range Selection */}
      {selectedReport === "custom" && (
        <div className="card">
          <div className="card-content">
            <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Report Preview</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-secondary hover:text-primary">
                <FaPrint size={20} />
              </button>
              <button className="p-2 text-secondary hover:text-primary">
                <FaDownload size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="card-content">
          {/* Report Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              {reportTypes.find((r) => r.id === selectedReport)?.name}
            </h3>
            <p className="text-secondary">
              Generated on {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
            <p className="text-secondary">
              Report Period:{" "}
              {selectedReport === "custom"
                ? `${dateRange.start} to ${dateRange.end}`
                : `Last ${selectedReport}`}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Executive Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              >
                <p className="text-sm text-secondary">Total Generation</p>
                <p className="text-2xl font-bold">
                  {sampleData.totalGeneration.toLocaleString()} MWh
                </p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              >
                <p className="text-sm text-secondary">Average Efficiency</p>
                <p className="text-2xl font-bold">
                  {sampleData.averageEfficiency}%
                </p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              >
                <p className="text-sm text-secondary">System Uptime</p>
                <p className="text-2xl font-bold">{sampleData.uptime}%</p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              >
                <p className="text-sm text-secondary">Cost per MWh</p>
                <p className="text-2xl font-bold">${sampleData.costPerMWh}</p>
              </div>
            </div>
          </div>

          {/* Generator Performance */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">
              Generator Performance
            </h4>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Generator</th>
                    <th>Total Output (MWh)</th>
                    <th>Avg Efficiency (%)</th>
                    <th>Uptime (%)</th>
                    <th>Fuel Consumption (L)</th>
                    <th>Maintenance Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {generators.map((generator) => (
                    <tr key={generator.id}>
                      <td className="font-medium">{generator.name}</td>
                      <td>{(Math.random() * 3000 + 2000).toFixed(0)}</td>
                      <td>{generator.efficiency}</td>
                      <td>{(Math.random() * 10 + 90).toFixed(1)}</td>
                      <td>{(Math.random() * 500 + 400).toFixed(0)}</td>
                      <td>{Math.floor(Math.random() * 8 + 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">
              Key Performance Indicators
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">Operational Metrics</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Peak Demand:</span>
                    <span className="font-medium">
                      {sampleData.peakDemand} MW
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Load Factor:</span>
                    <span className="font-medium">78.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Heat Rate:</span>
                    <span className="font-medium">9,850 BTU/kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Capacity Factor:</span>
                    <span className="font-medium">82.1%</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-3">Maintenance & Safety</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Total Incidents:</span>
                    <span className="font-medium">{sampleData.incidents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Maintenance Hours:</span>
                    <span className="font-medium">
                      {sampleData.maintenanceHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Safety Score:</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Compliance Rate:</span>
                    <span className="font-medium">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Recommendations</h4>
            <div className="space-y-3">
              <div className="alert alert-info">
                <p>
                  <strong>Efficiency Optimization:</strong> Generator 3 showing
                  lower efficiency. Consider scheduling maintenance to improve
                  performance.
                </p>
              </div>
              <div className="alert alert-success">
                <p>
                  <strong>Load Balancing:</strong> Current load distribution is
                  optimal. Continue monitoring for peak demand periods.
                </p>
              </div>
              <div className="alert alert-warning">
                <p>
                  <strong>Preventive Maintenance:</strong> Schedule routine
                  maintenance for Generator 1 and Generator 2 within the next 7
                  days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
