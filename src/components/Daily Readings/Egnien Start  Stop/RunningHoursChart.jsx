import React, { useEffect, useState } from "react";
import { db } from "../../FIrestore/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
} from "firebase/firestore";

export default function RunningHoursHybridChart() {
  const [engineData, setEngineData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [defaultDate, setDefaultDate] = useState("");

  // Initial fetch (latest records)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const q = query(
          collection(db, "engineReadings"),
          orderBy("date", "desc"),
          limit(1),
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
          const logs = snap.docs.map((doc) => doc.data());
          setEngineData(logs);
          setDefaultDate(logs[0]?.date || "");
        } else {
          alert("No engine readings found.");
        }
      } catch (err) {
        console.error("Error fetching engine readings:", err);
      }
    };

    fetchLatest();
  }, []);

  // Fetch when user selects a date
  useEffect(() => {
    const fetchByDate = async () => {
      if (!selectedDate) return;

      try {
        const q = query(
          collection(db, "engineReadings"),
          where("date", "==", selectedDate), // filter by chosen date
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
          const logs = snap.docs.map((doc) => doc.data());
          setEngineData(logs);
        } else {
          setEngineData([]);
        }
      } catch (err) {
        console.error("Error fetching engine readings:", err);
      }
    };

    fetchByDate();
  }, [selectedDate]);

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engineReadings.json";
    link.click();
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="card-title text-lg font-semibold text-blue">
          Running Hours Dashboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => downloadJSON(engineData)}
            className="btn-primary bg-blue-500 text-white px-3 py-1 rounded"
          >
            Export JSON
          </button>
        </div>
        <input
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
          value={selectedDate || defaultDate}
        />
      </div>
      <div className="card-content">
        <div className="overflow-x-auto">
          <table className="table w-full text-sm text-center border rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">E1</th>
                <th className="p-2">E2</th>
                <th className="p-2">E3</th>
                <th className="p-2">E4</th>
                <th className="p-2">E5</th>
              </tr>
            </thead>
            <tbody>
              {engineData.map((entry, entryIdx) => (
                <React.Fragment key={entryIdx}>
                  <tr>
                    <td rowSpan={2} className="p-2 font-medium border">
                      {entry?.date ?? "--"}
                    </td>
                    <td className="p-2 font-semibold border">
                      {window.innerWidth > 768 ? "Running Hours" : "Rhrs"}
                    </td>
                    {entry?.readings?.map((engine, idx) => (
                      <td
                        key={`rhrs-${entryIdx}-${idx}`}
                        className="p-2 border text-center"
                      >
                        {engine?.rhrs?.toFixed(2) ?? "--"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold border">
                      {window.innerWidth > 768 ? "KWH" : "Kwh"}
                    </td>
                    {entry?.readings?.map((engine, idx) => (
                      <td
                        key={`kwh-${entryIdx}-${idx}`}
                        className="p-2 border text-center"
                      >
                        {engine?.kwh?.toFixed(0) ?? "--"}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
