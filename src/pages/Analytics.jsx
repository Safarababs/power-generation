import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { FaChartBar, FaDownload } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const Analytics = () => {
  const { generators } = useData();
  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("output");

  // Generate sample historical data
  const generateHistoricalData = (days) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(
        Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      output: Math.random() * 200 + 300,
      efficiency: Math.random() * 20 + 75,
      fuel: Math.random() * 50 + 100,
      temperature: Math.random() * 15 + 80,
    }));
  };

  const historicalData = generateHistoricalData(
    timeRange === "day"
      ? 24
      : timeRange === "week"
      ? 7
      : timeRange === "month"
      ? 30
      : 365
  );

  const getMetricData = () => {
    switch (selectedMetric) {
      case "output":
        return {
          data: historicalData.map((d) => d.output),
          unit: "MW",
          color: "#3b82f6",
        };
      case "efficiency":
        return {
          data: historicalData.map((d) => d.efficiency),
          unit: "%",
          color: "#10b981",
        };
      case "fuel":
        return {
          data: historicalData.map((d) => d.fuel),
          unit: "L/h",
          color: "#f59e0b",
        };
      case "temperature":
        return {
          data: historicalData.map((d) => d.temperature),
          unit: "°C",
          color: "#ef4444",
        };
      default:
        return {
          data: historicalData.map((d) => d.output),
          unit: "MW",
          color: "#3b82f6",
        };
    }
  };

  const metricData = getMetricData();
  const maxValue = Math.max(...metricData.data);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics & Performance</h1>
        <div className="flex items-center space-x-4">
          <button className="btn btn-primary">
            <FaDownload size={16} className="btn-icon" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Generation</p>
                <p className="text-2xl font-bold">12,450 MWh</p>
              </div>
              <div className="flex items-center text-green">
                <FaArrowTrendUp size={20} />
                <span className="ml-1 text-sm">+5.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Avg Efficiency</p>
                <p className="text-2xl font-bold">84.7%</p>
              </div>
              <div className="flex items-center text-red">
                <FaArrowTrendDown size={20} />
                <span className="ml-1 text-sm">-1.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Fuel Consumption</p>
                <p className="text-2xl font-bold">2,840 L</p>
              </div>
              <div className="flex items-center text-green">
                <FaArrowTrendUp size={20} />
                <span className="ml-1 text-sm">+2.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Uptime</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <div className="flex items-center text-green">
                <FaArrowTrendUp size={20} />
                <span className="ml-1 text-sm">+0.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card">
        <div className="card-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="card-title">Performance Trends</h2>

            <div className="flex items-center space-x-4">
              <div
                className="flex rounded-lg p-1 text-sm"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              >
                {["output", "efficiency", "fuel", "temperature"].map(
                  (metric) => (
                    <button
                      key={metric}
                      className={`px-3 py-1 rounded-md capitalize ${
                        selectedMetric === metric
                          ? "btn-primary"
                          : "text-secondary"
                      }`}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      {metric}
                    </button>
                  )
                )}
              </div>

              <div
                className="flex rounded-lg p-1 text-sm"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              >
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 rounded-md capitalize ${
                      timeRange === range ? "btn-primary" : "text-secondary"
                    }`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card-content">
          <div className="chart-container">
            <div className="relative h-full">
              {/* Y-axis labels */}
              <div className="chart-y-axis">
                <div>
                  {Math.round(maxValue)} {metricData.unit}
                </div>
                <div>
                  {Math.round(maxValue * 0.75)} {metricData.unit}
                </div>
                <div>
                  {Math.round(maxValue * 0.5)} {metricData.unit}
                </div>
                <div>
                  {Math.round(maxValue * 0.25)} {metricData.unit}
                </div>
                <div>0 {metricData.unit}</div>
              </div>

              {/* Chart Grid */}
              <div className="chart-grid">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="chart-grid-line"
                    style={{ top: `${index * 25}%` }}
                  ></div>
                ))}

                {/* Chart Bars */}
                <div className="chart-bars">
                  {metricData.data.map((value, index) => {
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className="chart-bar"
                        style={{
                          height: `${height}%`,
                          backgroundColor: metricData.color,
                        }}
                      >
                        <div className="chart-tooltip">
                          {value.toFixed(1)} {metricData.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Performance Comparison */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generator Performance Comparison</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Generator</th>
                  <th>Current Output</th>
                  <th>Efficiency</th>
                  <th>Fuel Rate</th>
                  <th>Uptime</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {generators.map((generator) => (
                  <tr key={generator.id}>
                    <td className="font-medium">{generator.name}</td>
                    <td>{generator.output} MW</td>
                    <td>
                      <div className="flex items-center">
                        <span className="mr-2">{generator.efficiency}%</span>
                        <div className="w-16 progress-bar">
                          <div
                            className="progress-fill success"
                            style={{ width: `${generator.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{generator.fuelConsumption} L/h</td>
                    <td>{generator.uptime}</td>
                    <td>
                      <div className="flex items-center">
                        {generator.efficiency > 85 ? (
                          <div className="flex items-center text-green">
                            <FaArrowTrendUp size={16} />
                            <span className="ml-1 text-sm">Excellent</span>
                          </div>
                        ) : generator.efficiency > 75 ? (
                          <div className="flex items-center text-yellow">
                            <FaChartBar size={16} />
                            <span className="ml-1 text-sm">Good</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red">
                            <FaArrowTrendDown size={16} />
                            <span className="ml-1 text-sm">
                              Needs Attention
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
