import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../FIrestore/firebase";
import ReportDownload from "../report pdf's/ReportDownload";
import tagDescriptions from "./tagDescriptions.json";

// Firestore document IDs are already YYYY-MM-DD
const keyToDateInput = (key) => key || "";
const formatDateKey = (dateStr) => dateStr;
const formatReadableDate = (key) => key || "";

const SummaryViewer = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateKey, setDateKey] = useState(null);
  const [search, setSearch] = useState("");
  const getDescription = (tag) => tagDescriptions[tag] || tag;

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const snapshot = await getDocs(collection(db, "parameter_analyse"));
        if (!snapshot.empty) {
          const keys = snapshot.docs.map((doc) => doc.id);
          const latestKey = keys.sort().reverse()[0]; // latest date
          setDateKey(latestKey);
          await fetchSummary(latestKey);
        }
      } catch (err) {
        console.error("Error fetching latest summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const fetchSummary = async (key) => {
    setLoading(true);
    try {
      console.log("Fetching summary for key:", key);
      const docRef = doc(db, "parameter_analyse", key);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Fetched data:", docSnap.data());
        setSummary(docSnap.data());
      } else {
        console.warn("No summary found for date:", key);
        setSummary({});
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="spinner"></div>
        <span className="ml-3 text-primary font-medium">
          Loading summary...
        </span>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="card-header">
        <h2 className="card-title">
          Summary for {formatReadableDate(dateKey)}
        </h2>
      </div>

      {/* Date selector */}
      <div className="form-group">
        <label className="form-label">Select Date</label>
        <input
          type="date"
          className="form-input input-date"
          value={keyToDateInput(dateKey)}
          onChange={(e) => {
            const key = formatDateKey(e.target.value);
            console.log(
              "Selected date:",
              e.target.value,
              "→ Firestore key:",
              key,
            );
            setDateKey(key);
            fetchSummary(key);
          }}
        />
      </div>

      <div className="card-header flex justify-between items-center">
        <h2 className="card-title">Summary for {dateKey}</h2>
        <ReportDownload summary={summary} dateKey={dateKey} />
      </div>

      {/* Search bar */}
      <div className="form-group">
        <label className="form-label">Search Parameters</label>
        <input
          type="text"
          placeholder="Search by parameter..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="form-input w-full"
        />
      </div>

      {/* Responsive grid for engine tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(summary).map(([engineNo, engineData]) => (
          <div key={engineNo} className="card fade-in">
            <div className="card-header">
              <h3 className="card-title">{engineNo} Summary</h3>
            </div>
            <div className="card-content overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Parameter</th>
                    <th>Average</th>
                    <th>Max</th>
                    <th>Min</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(engineData.Parameters)
                    .sort(([tagA], [tagB]) => {
                      const descA = getDescription(tagA).toLowerCase();
                      const descB = getDescription(tagB).toLowerCase();
                      return descA.localeCompare(descB);
                    })
                    .filter(([param]) => {
                      if (!search) return true;
                      return param.toLowerCase().includes(search);
                    })
                    .map(([param, values], idx) => (
                      <tr key={`${engineNo}-${param}`}>
                        <td>{idx + 1}</td>
                        <td>{getDescription(param)}</td>
                        <td>{values.avg}</td>
                        <td>{values.max}</td>
                        <td>{values.min}</td>
                        <td>{values.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryViewer;
