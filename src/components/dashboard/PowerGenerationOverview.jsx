import React, { useEffect, useState } from "react";
import { FaBolt, FaBatteryFull } from "react-icons/fa";
import { IoMdTrendingDown, IoIosTrendingUp } from "react-icons/io";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const ImportReadings = () => {
  const [lastReading, setLastReading] = useState(null);
  const [secondLastReading, setSecondLastReading] = useState(null);
  const [lastFuelReading, setLastFuelReading] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const [minDate, setMinDate] = useState(today);

  // ✅ Fetch latest date once
  useEffect(() => {
    const qLatest = query(
      collection(db, "engineReadings"),
      orderBy("date", "desc"),
      limit(1),
    );
    getDocs(qLatest).then((snapshot) => {
      if (!snapshot.empty) {
        const latestDoc = snapshot.docs[0].data();
        if (latestDoc.date) {
          const firestoreDate = new Date(latestDoc.date)
            .toISOString()
            .split("T")[0];
          setSelectedDate(firestoreDate);
        }
      }
    });
  }, []);

  // ✅ Fetch oldest date once
  useEffect(() => {
    const qMin = query(
      collection(db, "engineReadings"),
      orderBy("date", "asc"),
      limit(1),
    );
    getDocs(qMin).then((snapshot) => {
      if (!snapshot.empty) {
        const firstDoc = snapshot.docs[0].data();
        if (firstDoc.date) {
          const firestoreDate = new Date(firstDoc.date)
            .toISOString()
            .split("T")[0];
          setMinDate(firestoreDate);
        }
      }
    });
  }, []);

  // ✅ Fetch readings for selected date + yesterday
  useEffect(() => {
    if (!selectedDate) return;

    // Engine readings for selected date
    const qEngine = query(
      collection(db, "engineReadings"),
      where("date", "==", selectedDate),
    );
    const unsubscribeEngine = onSnapshot(qEngine, (snapshot) => {
      if (!snapshot.empty) {
        setLastReading({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    });

    // Yesterday’s readings
    const yesterdayDate = new Date(selectedDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = yesterdayDate.toISOString().split("T")[0];
    const qYesterday = query(
      collection(db, "engineReadings"),
      where("date", "==", yesterdayKey),
    );
    const unsubscribeYesterday = onSnapshot(qYesterday, (snapshot) => {
      if (!snapshot.empty) {
        setSecondLastReading({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      }
    });

    // Fuel readings for selected date
    const qFuel = query(
      collection(db, "fuelReadings"),
      where("date", "==", selectedDate),
    );
    const unsubscribeFuel = onSnapshot(qFuel, (snapshot) => {
      if (!snapshot.empty) {
        setLastFuelReading({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      }
    });

    return () => {
      unsubscribeEngine();
      unsubscribeYesterday();
      unsubscribeFuel();
    };
  }, [selectedDate]);

  // ✅ Totals
  const totalKWH =
    lastReading?.generation.reduce((sum, g) => sum + g.kwh, 0) || 0;
  const totalRhrs =
    lastReading?.generation.reduce((sum, g) => sum + g.rhrs, 0) || 0;

  let totalCapacity = 9780;
  if (lastReading && lastFuelReading) {
    const activeEngines = lastReading.generation
      .map((g, idx) => ({
        kwh: g.kwh,
        capacity: lastFuelReading.consumption[idx]?.capacity || 9780,
      }))
      .filter((engine) => engine.kwh > 0);

    if (activeEngines.length > 0) {
      totalCapacity =
        activeEngines.reduce((sum, e) => sum + e.capacity, 0) /
        activeEngines.length;
    }
  }

  const averageOutputMW = totalRhrs ? totalKWH / totalRhrs : 0;
  const averageOutputPercentage = (averageOutputMW / totalCapacity) * 100;

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
            <div className="mb-4">
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                min={minDate}
              />
            </div>
            <span>Updated: </span>
            <span>
              {lastReading?.date
                ? new Date(lastReading.date).toLocaleDateString()
                : "Verify Date again..."}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Output */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "rgba(0,0,0,0.02)" }}
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
                  <span className="ml-1 text-sm font-medium">
                    No previous day data
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Daily Production */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "rgba(0,0,0,0.02)" }}
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
                  <span className="ml-1 text-sm font-medium">
                    No previous day data
                  </span>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-secondary">
              {secondLastReading
                ? `Yesterday: ${yesterdayKWH} KWh`
                : "No previous day data found"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportReadings;
