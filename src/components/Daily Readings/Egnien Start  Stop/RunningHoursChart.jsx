import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

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

export default function RunningHoursHybridChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const engines = useMemo(() => ["E1", "E2", "E3", "E4", "E5"], []);

  const calculateLogHours = (logs) => {
    let totalMs = 0;
    let lastStart = null;

    logs
      .sort((a, b) => a.eventDateTime - b.eventDateTime)
      .forEach((log) => {
        if (log.eventType === "start") {
          lastStart = log.eventDateTime;
        }
        if (log.eventType === "stop" && lastStart) {
          totalMs += log.eventDateTime - lastStart;
          lastStart = null;
        }
      });

    if (lastStart) {
      totalMs += new Date() - lastStart;
    }

    return totalMs / (1000 * 60 * 60);
  };

  useEffect(() => {
    const fetchHybridHours = async () => {
      try {
        const readingsSnap = await getDocs(
          query(
            collection(db, "engineReadings"),
            orderBy("date", "desc"),
            limit(1),
          ),
        );

        if (readingsSnap.empty) {
          console.warn("No meter readings found");
          setLoading(false);
          return;
        }

        const latestReadingDoc = readingsSnap.docs[0];
        const latestReading = latestReadingDoc.data();
        const meterDate = new Date(latestReading.date);

        const meterHoursArray = latestReading.readings.map(
          (eng) => eng.rhrs || 0,
        );

        const logsSnap = await getDocs(collection(db, "engineLogs"));
        const allLogs = logsSnap.docs.map((doc) => ({
          ...doc.data(),
          eventDateTime: doc.data().eventDateTime.toDate(),
        }));

        const hybridHours = engines.map((engine, index) => {
          const logsAfterMeter = allLogs.filter(
            (l) => l.engineId === engine && l.eventDateTime > meterDate,
          );
          const logHours = calculateLogHours(logsAfterMeter);
          return meterHoursArray[index] + logHours;
        });

        setChartData({
          labels: engines,
          datasets: [
            {
              label: "Hybrid Running Hours",
              data: hybridHours,
              backgroundColor: "rgba(54,162,235,0.7)",
              borderRadius: 6,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Hybrid calculation error:", error);
        setLoading(false);
      }
    };

    fetchHybridHours();
  }, [engines]); // include engines

  if (loading) return <p>Calculating hybrid running hours…</p>;
  if (!chartData) return <p>No data available.</p>;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Hybrid Running Hours (Meter + Logs)</h3>
      <Bar data={chartData} />
    </div>
  );
}
