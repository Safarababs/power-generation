import React, { useState, useEffect } from "react";
import { db } from "../FIrestore/firebase";
import {
  collection,
  query,
  orderBy,
  Timestamp,
  getDocs,
  where,
} from "firebase/firestore";

const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date.toDate) return date.toDate().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

const PowerGenerationChart = ({ currentUser }) => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, "engineReadings"),
          where("date", ">=", Timestamp.fromDate(startOfMonth)),
          where("date", "<=", Timestamp.fromDate(endOfMonth)),
          orderBy("date", "asc"),
        );

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => doc.data());

        if (docs.length > 0) {
          setToDate(formatDate(docs[0].date));
          setFromDate(formatDate(docs[docs.length - 1].date));
        }
      } catch (err) {
        console.error("Error fetching default dates:", err);
      } finally {
        setLoading(false);
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
        const q = query(
          collection(db, "engineReadings"),
          where("date", ">=", fromDate),
          where("date", "<=", toDate),
          orderBy("date", "asc"),
        );
        const snapshot = await getDocs(q);
        setData(snapshot.docs.map((doc) => doc.data()));
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
          <h2 className="card-title text-center sm:text-left">
            Power Generation Trends
          </h2>

          {currentUser?.department === "executive" ? (
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
          ) : null}
        </div>
      </div>

      <div className="card-content">
        {loading ? (
          <div className="p-4 text-center text-secondary">
            ⏳ Loading data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="p-4 text-center text-secondary">
            No data available
          </div>
        ) : (
          <div className="chart-container">
            <div className="chart-y-axis">
              <div>{maxValue} KWH</div>
              <div>{Math.round(maxValue * 0.75)} KWH</div>
              <div>{Math.round(maxValue * 0.5)} KWH</div>
              <div>{Math.round(maxValue * 0.25)} KWH</div>
              <div>0 KWH</div>
            </div>
            <div className="chart-grid">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="chart-grid-line"
                  style={{ top: `${i * 25}%` }}
                ></div>
              ))}
              <div className="chart-bars">
                {chartData.map((entry, index) => {
                  const height = maxValue ? (entry.value / maxValue) * 100 : 0;
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
        )}

        <div className="chart-x-axis flex justify-center">
          <p className="text-center text-secondary text-sm mt-2">
            {currentUser?.department === "executive"
              ? "Executives can adjust date range"
              : "Showing last 30 days generation data"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerGenerationChart;
