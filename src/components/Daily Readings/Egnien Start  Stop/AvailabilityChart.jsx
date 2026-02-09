import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import {
  calculateRunningHours,
  calculateAvailability,
} from "./Utils/calculateMetrics";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AvailabilityChart() {
  const [chartData, setChartData] = useState(null);
  const engines = ["E1", "E2", "E3", "E4", "E5"];
  const periodHours = 24 * 30; // Monthly example

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const snap = await getDocs(collection(db, "engineLogs"));
    const logs = snap.docs.map((d) => ({
      ...d.data(),
      eventDateTime: d.data().eventDateTime.toDate(),
    }));

    const availabilityData = engines.map((engine) => {
      const engineLogs = logs.filter((l) => l.engineId === engine);
      const hrs = calculateRunningHours(engineLogs);
      return calculateAvailability(hrs, periodHours);
    });

    setChartData({
      labels: engines,
      datasets: [
        {
          label: "Availability %",
          data: availabilityData,
          backgroundColor: "rgba(153,102,255,0.6)",
        },
      ],
    });
  };

  if (!chartData) return <p>Loading…</p>;

  return (
    <div style={{ width: "700px", marginTop: 20 }}>
      <h3>Engine Availability %</h3>
      <Bar data={chartData} />
    </div>
  );
}
