import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const SummaryViewer = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Example: fetch document for date "03072026"
        const dateKey = "03082026";
        const docRef = doc(db, "engine_summary", dateKey);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSummary(docSnap.data());
        } else {
          alert("No summary found for date:", dateKey);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Summary for date document</h2>
      </div>

      <div className="card-content">
        <div className="over-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Engine No</th>
                <th>Parameter</th>
                <th>Description</th>
                <th>Average</th>
                <th>Max</th>
                <th>Min</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([engineNo, params]) =>
                Object.entries(params).map(([param, values], idx) => (
                  <tr key={`${engineNo}-${param}`}>
                    <td>{engineNo}</td>
                    <td>{param}</td>
                    <td>{values.description}</td>
                    <td>{values.avg_value.toFixed(2)}</td>
                    <td>{values.max_value}</td>
                    <td>{values.min_value}</td>
                    <td>{values.alert_flag ? "⚠️" : "OK"}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
