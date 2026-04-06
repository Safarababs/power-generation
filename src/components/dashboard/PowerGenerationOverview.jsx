import React, { useEffect, useState } from "react";
import { FaBolt, FaBatteryFull } from "react-icons/fa";
import { IoMdTrendingDown, IoIosTrendingUp } from "react-icons/io";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const ImportReadings = ({ currentUser }) => {
  const [lastReading, setLastReading] = useState(null);
  const [secondLastReading, setSecondLastReading] = useState(null);
  const [thirdLastReading, setThirdLastReading] = useState(null);
  const [lastFuelReading, setLastFuelReading] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const minDate = "2020-12-07"; // hardcoded minimum

  // ✅ Fetch last 3 engine readings + fuel once
  useEffect(() => {
    const fetchData = async () => {
      const qEngine = query(
        collection(db, "engineReadings"),
        orderBy("date", "desc"),
        limit(3),
      );
      const engineSnap = await getDocs(qEngine);

      if (!engineSnap.empty) {
        const docs = engineSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastReading(docs[0] || null);
        setSecondLastReading(docs[1] || null);
        setThirdLastReading(docs[2] || null);

        if (docs[0]?.date) {
          const firestoreDate = new Date(docs[0].date)
            .toISOString()
            .split("T")[0];
          setSelectedDate(firestoreDate);

          // fuel for latest date
          const qFuel = query(
            collection(db, "fuelReadings"),
            where("date", "==", firestoreDate),
          );
          const fuelSnap = await getDocs(qFuel);
          if (!fuelSnap.empty) {
            setLastFuelReading({
              id: fuelSnap.docs[0].id,
              ...fuelSnap.docs[0].data(),
            });
          }
        }
      }
    };

    fetchData();
  }, []);

  // ✅ Fetch readings whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      // Engine readings for selected date
      const qEngine = query(
        collection(db, "engineReadings"),
        where("date", "==", selectedDate),
      );
      const engineSnap = await getDocs(qEngine);
      if (!engineSnap.empty) {
        setLastReading({
          id: engineSnap.docs[0].id,
          ...engineSnap.docs[0].data(),
        });
      } else {
        setLastReading(null);
      }

      // Yesterday’s readings
      const yesterdayDate = new Date(selectedDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = yesterdayDate.toISOString().split("T")[0];
      const qYesterday = query(
        collection(db, "engineReadings"),
        where("date", "==", yesterdayKey),
      );
      const yesterdaySnap = await getDocs(qYesterday);
      if (!yesterdaySnap.empty) {
        setSecondLastReading({
          id: yesterdaySnap.docs[0].id,
          ...yesterdaySnap.docs[0].data(),
        });
      } else {
        setSecondLastReading(null);
      }

      // Day before yesterday
      const dayBeforeDate = new Date(selectedDate);
      dayBeforeDate.setDate(dayBeforeDate.getDate() - 2);
      const dayBeforeKey = dayBeforeDate.toISOString().split("T")[0];
      const qDayBefore = query(
        collection(db, "engineReadings"),
        where("date", "==", dayBeforeKey),
      );
      const dayBeforeSnap = await getDocs(qDayBefore);
      if (!dayBeforeSnap.empty) {
        setThirdLastReading({
          id: dayBeforeSnap.docs[0].id,
          ...dayBeforeSnap.docs[0].data(),
        });
      } else {
        setThirdLastReading(null);
      }

      // Fuel readings for selected date
      const qFuel = query(
        collection(db, "fuelReadings"),
        where("date", "==", selectedDate),
      );
      const fuelSnap = await getDocs(qFuel);
      if (!fuelSnap.empty) {
        setLastFuelReading({
          id: fuelSnap.docs[0].id,
          ...fuelSnap.docs[0].data(),
        });
      } else {
        setLastFuelReading(null);
      }
    };

    fetchData();
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
  const dayBeforeKWH =
    thirdLastReading?.generation.reduce((sum, g) => sum + g.kwh, 0) || 0;

  // ✅ Trends
  const trendVsYesterday =
    yesterdayKWH > 0 ? ((totalKWH - yesterdayKWH) / yesterdayKWH) * 100 : null;
  const trendDirectionYesterday =
    trendVsYesterday !== null
      ? trendVsYesterday >= 0
        ? "increase"
        : "decrease"
      : null;

  const trendVsDayBefore =
    dayBeforeKWH > 0
      ? ((yesterdayKWH - dayBeforeKWH) / dayBeforeKWH) * 100
      : null;
  const trendDirectionDayBefore =
    trendVsDayBefore !== null
      ? trendVsDayBefore >= 0
        ? "increase"
        : "decrease"
      : null;

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title">Power Generation Overview</h2>
          {currentUser?.department === "executive" ? (
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
          ) : null}
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
              {trendVsYesterday !== null ? (
                <div
                  className={`flex items-center ${
                    trendDirectionYesterday === "increase"
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {trendDirectionYesterday === "increase" ? (
                    <IoIosTrendingUp size={18} />
                  ) : (
                    <IoMdTrendingDown size={18} />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {trendVsYesterday.toFixed(1)}%
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
              {trendVsYesterday !== null ? (
                <div
                  className={`flex items-center ${
                    trendDirectionYesterday === "increase"
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {trendDirectionYesterday === "increase" ? (
                    <IoIosTrendingUp size={18} />
                  ) : (
                    <IoMdTrendingDown size={18} />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {trendVsYesterday.toFixed(1)}%
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
              {thirdLastReading && (
                <div>
                  Day Before: {dayBeforeKWH} KWh (
                  {trendVsDayBefore !== null ? (
                    <>
                      {trendDirectionDayBefore === "increase" ? (
                        <IoIosTrendingUp size={12} />
                      ) : (
                        <IoMdTrendingDown size={12} />
                      )}
                      {trendVsDayBefore.toFixed(1)}%
                    </>
                  ) : (
                    "No trend"
                  )}
                  )
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportReadings;
