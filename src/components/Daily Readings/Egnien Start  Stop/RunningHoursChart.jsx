// import React, { useEffect, useState, useMemo } from "react";
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
// import { db } from "../../FIrestore/firebase";

// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// export default function RunningHoursHybridChart() {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const engines = useMemo(() => ["E1", "E2", "E3", "E4", "E5"], []);

//   const calculateLogHours = (logs) => {
//     let totalMs = 0;
//     let lastStart = null;

//     logs
//       .sort((a, b) => a.eventDateTime - b.eventDateTime)
//       .forEach((log) => {
//         if (log.eventType === "start") {
//           lastStart = log.eventDateTime;
//         }
//         if (log.eventType === "stop" && lastStart) {
//           totalMs += log.eventDateTime - lastStart;
//           lastStart = null;
//         }
//       });

//     if (lastStart) {
//       totalMs += new Date() - lastStart;
//     }

//     return totalMs / (1000 * 60 * 60);
//   };

//   useEffect(() => {
//     const fetchHybridHours = async () => {
//       try {
//         const readingsSnap = await getDocs(
//           query(
//             collection(db, "engineReadings"),
//             orderBy("date", "desc"),
//             limit(1),
//           ),
//         );

//         if (readingsSnap.empty) {
//           console.warn("No meter readings found");
//           setLoading(false);
//           return;
//         }

//         const latestReadingDoc = readingsSnap.docs[0];
//         const latestReading = latestReadingDoc.data();
//         const meterDate = new Date(latestReading.date);

//         const meterHoursArray = latestReading.readings.map(
//           (eng) => eng.rhrs || 0,
//         );

//         const logsSnap = await getDocs(collection(db, "engineLogs"));
//         const allLogs = logsSnap.docs.map((doc) => ({
//           ...doc.data(),
//           eventDateTime: doc.data().eventDateTime.toDate(),
//         }));

//         const hybridHours = engines.map((engine, index) => {
//           const logsAfterMeter = allLogs.filter(
//             (l) => l.engineId === engine && l.eventDateTime > meterDate,
//           );
//           const logHours = calculateLogHours(logsAfterMeter);
//           return meterHoursArray[index] + logHours;
//         });

//         setChartData({
//           labels: engines,
//           datasets: [
//             {
//               label: "Hybrid Running Hours",
//               data: hybridHours,
//               backgroundColor: "rgba(54,162,235,0.7)",
//               borderRadius: 6,
//             },
//           ],
//         });

//         setLoading(false);
//       } catch (error) {
//         console.error("Hybrid calculation error:", error);
//         setLoading(false);
//       }
//     };

//     fetchHybridHours();
//   }, [engines]); // include engines

//   if (loading) return <p>Calculating hybrid running hours…</p>;
//   if (!chartData) return <p>No data available.</p>;

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "900px",
//         background: "#fff",
//         padding: "15px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//       }}
//     >
//       <h3>Hybrid Running Hours (Meter + Logs)</h3>
//       <Bar data={chartData} />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { db } from "../../FIrestore/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function RunningHoursHybridChart() {
  const [engineData, setEngineData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const dateKey = yesterday.toISOString().split("T")[0]; // yesterday’s doc
        const sixAM = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          6,
          0,
          0,
        );

        const engineIds = ["E1", "E2", "E3", "E4", "E5"];
        const results = {};

        // Get yesterday’s official readings
        const engineDocSnap = await getDoc(doc(db, "engineReadings", dateKey));
        const generationArray = engineDocSnap.exists()
          ? engineDocSnap.data().readings
          : [];

        for (let i = 0; i < engineIds.length; i++) {
          const id = engineIds[i];
          const baseline = generationArray[i]?.rhrs || 0;

          // Query logs since today 6 AM
          const q = query(
            collection(db, "engineLogs"),
            where("engineId", "==", id),
            orderBy("eventDateTime", "asc"),
          );

          const snap = await getDocs(q);
          const logs = snap.docs
            .map((d) => d.data())
            .filter((log) => log.eventDateTime.toDate() >= sixAM);

          let liveHours = 0;
          let lastStart = null;

          for (const log of logs) {
            const eventTime = log.eventDateTime.toDate();
            if (log.eventType === "start") {
              lastStart = eventTime;
            } else if (log.eventType === "stop" && lastStart) {
              liveHours += (eventTime - lastStart) / (1000 * 60 * 60);
              lastStart = null;
            }
          }

          // If engine still running now
          if (lastStart) {
            liveHours += (new Date() - lastStart) / (1000 * 60 * 60);
          }

          results[id] = {
            baseline: baseline, // number
            live: liveHours, // number
            total: baseline + liveHours, // number
          };
        }

        setEngineData(results);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Running Hours Dashboard</h2>
      </div>
      <div className="card-content">
        <div className="overflow-x-auto">
          {Object.keys(engineData).length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Engine</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(engineData).map(([id, data]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{data.total.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            "Loading dashboard..."
          )}
        </div>
      </div>
    </div>
  );
}
