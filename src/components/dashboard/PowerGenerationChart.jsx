import React, { useState, useEffect } from "react";
import { db } from "../FIrestore/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";

// Helper to format Firestore date field (string or Timestamp)
const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date; // already YYYY-MM-DD
  if (date.toDate) return date.toDate().toISOString().split("T")[0]; // Firestore Timestamp
  return new Date(date).toISOString().split("T")[0];
};

const PowerGenerationChart = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch last 7 docs to set default range
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const q = query(
          collection(db, "engineReadings"),
          orderBy("date", "desc"),
          // if on mobile screen we can reduce this to 7 to speed up loading
          window.innerWidth < 768 ? limit(7) : limit(7),
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => doc.data());

        if (docs.length > 0) {
          // last item = newest date
          const newest = formatDate(docs[0].date);
          const oldest = formatDate(docs[docs.length - 1].date);
          setToDate(newest);
          setFromDate(oldest);
        }
      } catch (err) {
        console.error("Error fetching default dates:", err);
      }
    };
    fetchDefaults();
  }, []);

  // Fetch data based on range
  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate || !toDate) return;
      setLoading(true);
      try {
        let q = query(
          collection(db, "engineReadings"),
          where("date", ">=", fromDate),
          where("date", "<=", toDate),
          orderBy("date", "asc"),
        );

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => doc.data());
        setData(docs);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const sumGeneration = (generation) =>
    generation ? generation.reduce((sum, g) => sum + (g.kwh || 0), 0) : 0;

  const chartData = data.map((doc) => ({
    date: formatDate(doc.date),
    value: sumGeneration(doc.generation),
  }));

  const maxValue = chartData.length
    ? Math.max(...chartData.map((d) => d.value))
    : 0;

  return (
    <div className="card">
      <div className="card-header flex space-around">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
          {/* Title */}
          <h2 className="card-title text-center sm:text-left">
            Power Generation Trends
          </h2>

          {/* Date inputs in one row */}
          <div className="flex flex-row gap-4 justify-center sm:justify-end">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input input-date"
              max={today}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input input-date"
              max={today}
            />
          </div>
        </div>
      </div>

      <div className="card-content">
        {loading ? (
          <div className="p-4 text-center text-secondary">Loading data...</div>
        ) : chartData.length === 0 ? (
          <div className="p-4 text-center text-secondary">
            No data available
          </div>
        ) : (
          <>
            <div className="chart-container">
              {/* Y-axis */}
              <div className="chart-y-axis">
                <div>{maxValue} KWH</div>
                <div>{Math.round(maxValue * 0.75)} KWH</div>
                <div>{Math.round(maxValue * 0.5)} KWH</div>
                <div>{Math.round(maxValue * 0.25)} KWH</div>
                <div>0 KWH</div>
              </div>

              {/* Grid */}
              <div className="chart-grid">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="chart-grid-line"
                    style={{ top: `${i * 25}%` }}
                  ></div>
                ))}

                {/* Bars */}
                <div className="chart-bars">
                  {chartData.map((entry, index) => {
                    const height = maxValue
                      ? (entry.value / maxValue) * 100
                      : 0;
                    return (
                      <div
                        key={index}
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                      >
                        <div className="chart-tooltip">
                          {entry.value} KWH
                          <br />
                          {entry.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* X-axis labels BELOW the chart */}
        <div className="chart-x-axis flex justify-center">
          <p className="text-center text-secondary text-sm mt-2">
            Here we can view the last 7 days generation data (to view the values
            please hover over the bars)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerGenerationChart;
