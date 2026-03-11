import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../FIrestore/firebase";
import ReportDownload from "../report pdf's/ReportDownload";

// Convert Firestore ID (MMDDYYYY) → YYYY-MM-DD for <input type="date" />
const keyToDateInput = (key) => {
  if (!key || key.length !== 8) return "";
  const month = key.substring(0, 2);
  const day = key.substring(2, 4);
  const year = key.substring(4);
  return `${year}-${month}-${day}`;
};

// Convert YYYY-MM-DD → Firestore ID (MMDDYYYY)
const formatDateKey = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${month}${day}${year}`;
};

// Human-readable heading
const formatReadableDate = (key) => {
  if (!key || key.length !== 8) return key;
  const month = key.substring(0, 2);
  const day = key.substring(2, 4);
  const year = key.substring(4);
  return `Month ${month} Day ${day} Year ${year}`;
};

const SummaryViewer = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateKey, setDateKey] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const snapshot = await getDocs(collection(db, "engine_summary"));
      if (!snapshot.empty) {
        const keys = snapshot.docs.map((doc) => doc.id);
        const latestKey = keys.sort().reverse()[0];
        console.log("Latest key:", latestKey);
        setDateKey(latestKey);
        await fetchSummary(latestKey);
      }
    } catch (err) {
      console.error("Error fetching latest summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (key) => {
    setLoading(true);
    try {
      console.log("Fetching summary for key:", key);
      const docRef = doc(db, "engine_summary", key);
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

  useEffect(() => {
    console.log("Summary state updated:", summary);
  }, [summary]);

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
          value={keyToDateInput(dateKey)} // auto-fill with latest doc
          onChange={(e) => {
            const key = formatDateKey(e.target.value);
            console.log(
              "Selected date:",
              e.target.value,
              "→ Firestore key:",
              key,
            );
            setDateKey(key);
            fetchSummary(key); // fetch new data
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
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="form-input w-full"
        />
      </div>

      {/* Responsive grid for engine tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(summary).map(([engineNo, params]) => (
          <div key={engineNo} className="card fade-in">
            <div className="card-header">
              <h3 className="card-title">Engine {engineNo} Summary</h3>
            </div>
            <div className="card-content overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Parameter</th>
                    <th>Description</th>
                    <th>Average</th>
                    <th>Max</th>
                    <th>Min</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(params)
                    .filter(([, values]) => {
                      if (!search) return true;
                      return (
                        values.description &&
                        values.description
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      );
                    })
                    .map(([param, values], idx) => (
                      <tr key={`${engineNo}-${param}`}>
                        <td>{idx + 1}</td>
                        <td>{param}</td>
                        <td>{values.description}</td>
                        <td>{values.avg_value?.toFixed(2)}</td>
                        <td>{values.max_value}</td>
                        <td>{values.min_value}</td>
                        <td>{values.alert_flag ? "⚠️" : "OK"}</td>
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
