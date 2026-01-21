import React, { useEffect, useState } from "react";
import { FaBolt, FaBatteryFull } from "react-icons/fa";
import { IoMdTrendingDown, IoIosTrendingUp } from "react-icons/io";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const ImportReadings = () => {
  const [lastReading, setLastReading] = useState(null);
  const [secondLastReading, setSecondLastReading] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "engineReadings"),
      orderBy("date", "desc"),
      limit(2),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          generation: data.generation || [],
          date: data.date,
          timestamp: data.timestamp || null,
        };
      });

      if (docs.length > 0) {
        setLastReading(docs[0]);
        if (docs.length > 1) {
          setSecondLastReading(docs[1]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Totals from generation array
  const totalKWH =
    lastReading?.generation.reduce((sum, g) => sum + g.kwh, 0) || 0;
  const totalRhrs =
    lastReading?.generation.reduce((sum, g) => sum + g.rhrs, 0) || 0;

  // Assume total capacity is 9500 kW
  const totalCapacity = 9500;
  const averageOutputMW = totalRhrs ? totalKWH / totalRhrs : 0;
  const averageOutputPercentage = (averageOutputMW / totalCapacity) * 100;

  // ✅ Trend calculation
  const yesterdayKWH =
    secondLastReading?.generation.reduce((sum, g) => sum + g.kwh, 0) || 0;

  let trendPercent = null;
  let trendDirection = null;

  if (yesterdayKWH > 0) {
    trendPercent = ((totalKWH - yesterdayKWH) / yesterdayKWH) * 100;
    trendDirection = trendPercent >= 0 ? "increase" : "decrease";
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title">Power Generation Overview</h2>
          <div className="text-sm text-secondary">
            <span>Updated: </span>
            <span>
              {lastReading?.timestamp
                ? lastReading.timestamp.toDate().toLocaleString()
                : "Loading..."}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Output (percentage of capacity) */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
          >
            <div className="flex items-center mb-2">
              <FaBolt
                size={20}
                style={{ color: "#f59e0b", marginRight: "0.5rem" }}
              />
              <span className="text-secondary font-medium">Average Output</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">
                  {averageOutputPercentage.toFixed(2)}
                </span>
                <span className="text-lg ml-1">%</span>
              </div>
              {trendPercent !== null ? (
                <div
                  className={`flex items-center ${
                    trendDirection === "increase" ? "text-green" : "text-red"
                  }`}
                >
                  {trendDirection === "increase" ? (
                    <IoIosTrendingUp size={18} />
                  ) : (
                    <IoMdTrendingDown size={18} />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {trendPercent.toFixed(1)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-secondary">
                  <span className="ml-1 text-sm font-medium">N/A</span>
                </div>
              )}
            </div>
          </div>

          {/* Daily Production */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
          >
            <div className="flex items-center mb-2">
              <FaBatteryFull
                size={20}
                style={{ color: "#3b82f6", marginRight: "0.5rem" }}
              />
              <span className="text-secondary font-medium">
                Daily Production
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">{totalKWH}</span>
                <span className="text-lg ml-1">KWh</span>
              </div>
              {trendPercent !== null ? (
                <div
                  className={`flex items-center ${
                    trendDirection === "increase" ? "text-green" : "text-red"
                  }`}
                >
                  {trendDirection === "increase" ? (
                    <IoIosTrendingUp size={18} />
                  ) : (
                    <IoMdTrendingDown size={18} />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {trendPercent.toFixed(1)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-secondary">
                  <span className="ml-1 text-sm font-medium">N/A</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-secondary">
              Yesterday: {yesterdayKWH} KWh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportReadings;
