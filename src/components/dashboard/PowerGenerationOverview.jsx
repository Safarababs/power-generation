import React, { useEffect, useState } from "react";
import { FaBolt, FaBatteryFull } from "react-icons/fa";
import { IoMdTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const PowerGenerationOverview = () => {
  const [readings, setReadings] = useState([]);
  const [lastReading, setLastReading] = useState(null);
  const [secondLastReading, setSecondLastReading] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "engineReadings"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return (
            docData.readings?.map((r) => ({
              kwh: Number(r.kwh),
              rhrs: Number(r.rhrs),
              timestamp: r.timestamp || null,
            })) || []
          );
        });

        const flat = data.flat();

        if (flat.length > 0) {
          // Sort by timestamp so we know which is latest
          const sorted = [...flat].sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return a.timestamp.seconds - b.timestamp.seconds;
            }
            return 0;
          });

          setLastReading(sorted[sorted.length - 1]);
          if (sorted.length > 1) {
            setSecondLastReading(sorted[sorted.length - 2]);
          }
        }

        setReadings(flat);
      }
    );

    return () => unsubscribe();
  }, []);

  // Aggregate totals (all-time)
  const totalKWH = readings.reduce((sum, r) => sum + r.kwh, 0);

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
          {/* Average Output */}
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
                  {(totalKWH / 1000).toFixed(2)}
                </span>
                <span className="text-lg ml-1">MW</span>
              </div>
              <div className="flex items-center text-green">
                <IoIosTrendingUp size={18} />
                <span className="ml-1 text-sm font-medium">+2.4%</span>
              </div>
            </div>
          </div>

          {/* Daily Production (today’s reading) */}
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
                <span className="text-3xl font-bold">
                  {lastReading?.kwh || 0}
                </span>
                <span className="text-lg ml-1">KWh</span>
              </div>
              <div className="flex items-center text-red">
                <IoMdTrendingDown size={18} />
                <span className="ml-1 text-sm font-medium">
                  {secondLastReading
                    ? (
                        ((lastReading?.kwh - secondLastReading.kwh) /
                          secondLastReading.kwh) *
                        100
                      ).toFixed(1) + "%"
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-secondary">
              Yesterday: {secondLastReading?.kwh || 0} KWh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerGenerationOverview;
