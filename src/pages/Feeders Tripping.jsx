import React, { useState, useMemo } from "react";
import { useFeedersTripping } from "../context/Feeders Tripping Data";

// Helpers for totals
function toMinutes(value) {
  if (!value || value === "-" || value.toLowerCase() === "nill") return 0;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

const FeedersTripping = () => {
  const { feedersTrippingData } = useFeedersTripping();

  // Dropdown filters
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Machine groups
  const groups = {
    all: ["kiln1", "kiln2", "rm1", "rm2", "cm1", "cm2", "cm3"],
    kilns: ["kiln1", "kiln2"],
    rms: ["rm1", "rm2"],
    cms: ["cm1", "cm2", "cm3"],
  };
  const visibleMachines = groups[selectedGroup];

  // Filter data by month
  const filteredData =
    selectedMonth === "all"
      ? feedersTrippingData
      : feedersTrippingData.filter((row) => row.month === selectedMonth);

  // Calculate grand totals
  const totals = useMemo(() => {
    const result = {};
    visibleMachines.forEach((m) => {
      let totalStops = 0;
      let totalMinutes = 0;
      filteredData.forEach((row) => {
        const stops = row[m].stops;
        if (typeof stops === "number") totalStops += stops;
        totalMinutes += toMinutes(row[m].hours);
      });
      result[m] = { stops: totalStops, hours: toHHMM(totalMinutes) };
    });
    return result;
  }, [filteredData, visibleMachines]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feeders Tripping Record</h1>
        <div className="flex gap-4">
          {/* Group Selector */}
          <div>
            <label className="mr-2 font-medium">Select Group:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All Machines</option>
              <option value="kilns">Kilns Only</option>
              <option value="rms">Raw Meals Only</option>
              <option value="cms">Cement Mills Only</option>
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="mr-2 font-medium">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All Months</option>
              {feedersTrippingData.map((row) => (
                <option key={row.id} value={row.month}>
                  {row.month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Stoppage Record */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Monthly Stoppage Record (Hours:Minutes)
          </h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Month</th>
                  <th>
                    Hours
                    <br />
                    Stops
                  </th>
                  {visibleMachines.includes("kiln1") && <th>Kiln #1</th>}
                  {visibleMachines.includes("kiln2") && <th>Kiln #2</th>}
                  {visibleMachines.includes("rm1") && <th>RM #1</th>}
                  {visibleMachines.includes("rm2") && <th>RM #2</th>}
                  {visibleMachines.includes("cm1") && <th>CM #1</th>}
                  {visibleMachines.includes("cm2") && <th>CM #2</th>}
                  {visibleMachines.includes("cm3") && <th>CM #3</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (
                  <React.Fragment key={data.id}>
                    {/* Hours row */}
                    <tr>
                      <td rowSpan="2">{index + 1}</td>
                      <td rowSpan="2" className="font-medium">
                        {data.month}
                      </td>
                      <td className="font-medium">Hours</td>
                      {visibleMachines.includes("kiln1") && (
                        <td>{data.kiln1.hours}</td>
                      )}
                      {visibleMachines.includes("kiln2") && (
                        <td>{data.kiln2.hours}</td>
                      )}
                      {visibleMachines.includes("rm1") && (
                        <td>{data.rm1.hours}</td>
                      )}
                      {visibleMachines.includes("rm2") && (
                        <td>{data.rm2.hours}</td>
                      )}
                      {visibleMachines.includes("cm1") && (
                        <td>{data.cm1.hours}</td>
                      )}
                      {visibleMachines.includes("cm2") && (
                        <td>{data.cm2.hours}</td>
                      )}
                      {visibleMachines.includes("cm3") && (
                        <td>{data.cm3.hours}</td>
                      )}
                    </tr>
                    {/* Stops row */}
                    <tr>
                      <td className="font-medium">Stops</td>
                      {visibleMachines.includes("kiln1") && (
                        <td>{data.kiln1.stops}</td>
                      )}
                      {visibleMachines.includes("kiln2") && (
                        <td>{data.kiln2.stops}</td>
                      )}
                      {visibleMachines.includes("rm1") && (
                        <td>{data.rm1.stops}</td>
                      )}
                      {visibleMachines.includes("rm2") && (
                        <td>{data.rm2.stops}</td>
                      )}
                      {visibleMachines.includes("cm1") && (
                        <td>{data.cm1.stops}</td>
                      )}
                      {visibleMachines.includes("cm2") && (
                        <td>{data.cm2.stops}</td>
                      )}
                      {visibleMachines.includes("cm3") && (
                        <td>{data.cm3.stops}</td>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="2">Grand Total</td>
                  <td>Hours</td>
                  {visibleMachines.map((m) => (
                    <td key={m}>{totals[m].hours}</td>
                  ))}
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="2"></td>
                  <td>Stops</td>
                  {visibleMachines.map((m) => (
                    <td key={m}>{totals[m].stops}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedersTripping;
