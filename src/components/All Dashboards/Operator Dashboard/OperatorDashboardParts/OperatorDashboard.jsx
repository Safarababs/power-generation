import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";
import "./operatorDashboard.css";

import MillSection from "./MillSection";
import EngineSection from "./EngineSection";
import EquipmentSection from "./EquipmentSection";
import MillSummaryTable from "./MillSummaryTable";

function getSafeDate(value) {
  if (!value) return null;

  if (value?.toDate) {
    const d = value.toDate();
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "object" && typeof value.seconds === "number") {
    const d = new Date(value.seconds * 1000);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value) {
  const date = getSafeDate(value);
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDateTime(value) {
  const date = getSafeDate(value);
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function hoursBetween(from, to) {
  const start = getSafeDate(from);
  const end = getSafeDate(to);
  if (!start || !end || end <= start) return 0;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function getLastClosedOperationalWindow(now = new Date()) {
  const current = new Date(now);
  const sixAMToday = new Date(current);
  sixAMToday.setHours(6, 0, 0, 0);

  const end = new Date(sixAMToday);
  const start = new Date(end);
  start.setDate(start.getDate() - 1);

  return { start, end };
}

function getCurrentOperationalWindow(now = new Date()) {
  const current = new Date(now);
  const sixAMToday = new Date(current);
  sixAMToday.setHours(6, 0, 0, 0);

  if (current >= sixAMToday) {
    const start = new Date(sixAMToday);
    const end = new Date(sixAMToday);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  const end = new Date(sixAMToday);
  const start = new Date(end);
  start.setDate(start.getDate() - 1);
  return { start, end };
}

function getOperationalEntryDateKey(now = new Date()) {
  const { start } = getLastClosedOperationalWindow(now);
  return start.toISOString().split("T")[0];
}

function buildYesterdayMillSummary(
  millHistory = [],
  millCurrentStatus = {},
  now = new Date(),
) {
  const MILL_NAMES = ["CM1", "CM2", "CM3", "RM1", "RM2", "KILN1", "KILN2"];
  const { start, end } = getLastClosedOperationalWindow(now);

  const grouped = millHistory.reduce((acc, item) => {
    if (!item?.millName) return acc;
    if (!acc[item.millName]) acc[item.millName] = [];
    acc[item.millName].push(item);
    return acc;
  }, {});

  return MILL_NAMES.map((millName) => {
    const records = (grouped[millName] || []).sort((a, b) => {
      const aTime =
        getSafeDate(a.createdAt) ||
        getSafeDate(a.stopTime) ||
        getSafeDate(a.startTime) ||
        new Date(0);

      const bTime =
        getSafeDate(b.createdAt) ||
        getSafeDate(b.stopTime) ||
        getSafeDate(b.startTime) ||
        new Date(0);

      return aTime.getTime() - bTime.getTime();
    });

    let totalStoppedHours = 0;

    records.forEach((record, index) => {
      if (record.currentlyRunning !== false || !record.stopTime) return;

      const stopDate = getSafeDate(record.stopTime);
      const nextRecord = records[index + 1];
      const startDate =
        nextRecord?.currentlyRunning === true && nextRecord?.startTime
          ? getSafeDate(nextRecord.startTime)
          : end;

      if (!stopDate || !startDate) return;

      const effectiveStart = stopDate < start ? start : stopDate;
      const effectiveEnd = startDate > end ? end : startDate;

      if (effectiveEnd > effectiveStart) {
        totalStoppedHours += hoursBetween(effectiveStart, effectiveEnd);
      }
    });

    const current = millCurrentStatus[millName] || {};
    const currentRunning = Boolean(current.currentlyRunning);

    return {
      millName,
      totalStoppedHours,
      totalRunningHours: Math.max(0, 24 - totalStoppedHours),
      currentStatus: currentRunning ? "RUNNING" : "STOPPED",
      currentSince: currentRunning
        ? formatShortDateTime(current.startTime)
        : formatShortDateTime(current.stopTime || current.startTime),
    };
  });
}

function SummaryRibbonItem({ label, value, tone = "blue" }) {
  return (
    <div className={`operator-ribbon-item tone-${tone}`}>
      <span className="operator-ribbon-label">{label}</span>
      <strong className="operator-ribbon-value">{value}</strong>
    </div>
  );
}

export default function OperatorDashboard() {
  const [now, setNow] = useState(new Date());

  const [millCurrentStatus, setMillCurrentStatus] = useState({});
  const [millHistory, setMillHistory] = useState([]);
  const [engineStatus, setEngineStatus] = useState({});
  const [boilerStatus, setBoilerStatus] = useState({});
  const [roStatus, setRoStatus] = useState({});

  const [generationDoc, setGenerationDoc] = useState(null);
  const [fuelDoc, setFuelDoc] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubMills = onSnapshot(
      collection(db, "millCurrentStatus"),
      (snapshot) => {
        const map = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data();
        });
        setMillCurrentStatus(map);
      },
    );

    const millHistoryQuery = query(
      collection(db, "millStatusHistory"),
      orderBy("createdAt", "desc"),
    );

    const unsubMillHistory = onSnapshot(millHistoryQuery, (snapshot) => {
      const records = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMillHistory(records);
    });

    const unsubEngines = onSnapshot(
      collection(db, "engineStatus"),
      (snapshot) => {
        const map = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data();
        });
        setEngineStatus(map);
      },
    );

    const unsubBoilers = onSnapshot(
      collection(db, "boilerStatus"),
      (snapshot) => {
        const map = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data();
        });
        setBoilerStatus(map);
      },
    );

    const unsubRO = onSnapshot(collection(db, "roStatus"), (snapshot) => {
      const map = {};
      snapshot.forEach((docSnap) => {
        map[docSnap.id] = docSnap.data();
      });
      setRoStatus(map);
    });

    return () => {
      unsubMills();
      unsubMillHistory();
      unsubEngines();
      unsubBoilers();
      unsubRO();
    };
  }, []);

  useEffect(() => {
    const loadYesterdayOperationalDocs = async () => {
      const docKey = getOperationalEntryDateKey(new Date());

      const [generationSnap, fuelSnap] = await Promise.all([
        getDoc(doc(db, "engineReadings", docKey)),
        getDoc(doc(db, "fuelReadings", docKey)),
      ]);

      setGenerationDoc(generationSnap.exists() ? generationSnap.data() : null);
      setFuelDoc(fuelSnap.exists() ? fuelSnap.data() : null);
    };

    loadYesterdayOperationalDocs();
  }, []);

  const currentWindow = useMemo(() => getCurrentOperationalWindow(now), [now]);
  const closedWindow = useMemo(
    () => getLastClosedOperationalWindow(now),
    [now],
  );

  const generation = generationDoc?.generation || [];
  const engineMeterReadings = generationDoc?.readings || [];
  const fuelConsumption = fuelDoc?.consumption || [];

  const yesterdayMillSummary = useMemo(() => {
    return buildYesterdayMillSummary(millHistory, millCurrentStatus, now);
  }, [millHistory, millCurrentStatus, now]);

  const topMetrics = useMemo(() => {
    const engineNames = ["E1", "E2", "E3", "E4", "E5"];

    function getEngineCapacity(engineName, fuelItem = {}) {
      if (engineName === "E1" || engineName === "E2" || engineName === "E3") {
        return 9780;
      }

      if (engineName === "E4" || engineName === "E5") {
        const gasNm3 = Number(fuelItem?.gasNm3 || 0);
        const gasKg = Number(fuelItem?.gasKg || 0);
        const gasMode = gasNm3 <= 200 && gasKg <= 200;
        return gasMode ? 9766 : 8997;
      }

      return 0;
    }

    let totalKwh = 0;
    let totalRhrs = 0;
    let totalCapacityHours = 0;
    let totalFuelKg = 0;

    generation.forEach((item, index) => {
      const kwh = Number(item?.kwh || 0);
      const rhrs = Number(item?.rhrs || 0);
      const capacity = getEngineCapacity(
        engineNames[index],
        fuelConsumption[index] || {},
      );

      totalKwh += kwh;
      totalRhrs += rhrs;
      totalCapacityHours += capacity * rhrs;
    });

    fuelConsumption.forEach((item) => {
      totalFuelKg += Number(item?.hfoKg || 0);
      totalFuelKg += Number(item?.lfoKg || 0);
      totalFuelKg += Number(item?.gasKg || 0);
    });

    const generationPercent =
      totalCapacityHours > 0 ? (totalKwh / totalCapacityHours) * 100 : 0;

    const averageLoad = totalRhrs > 0 ? totalKwh / totalRhrs : 0;

    return {
      totalKwh,
      totalRhrs,
      generationPercent,
      averageLoad,
      totalFuelKg,
      runningEngines: Object.values(engineStatus).filter(
        (item) => item?.currentStatus === "running",
      ).length,
      runningMills: Object.values(millCurrentStatus).filter(
        (item) => item?.currentlyRunning === true,
      ).length,
    };
  }, [generation, fuelConsumption, engineStatus, millCurrentStatus]);

  return (
    <div className="operator-dashboard-page compact-dashboard">
      <div className="operator-dashboard-grid compact-grid">
        <section className="card operator-hero-card compact-hero">
          <div className="card-content operator-hero-content compact-hero-content">
            <div>
              <h1 className="operator-page-title">PG-IPS</h1>
              <p className="operator-page-subtitle">
                Live operator command center
              </p>
            </div>
          </div>
        </section>

        <section className="operator-summary-ribbon">
          <SummaryRibbonItem
            label="Generation %"
            value={formatPercent(topMetrics.generationPercent)}
            tone="green"
          />
          <SummaryRibbonItem
            label="Total KWH"
            value={formatNumber(topMetrics.totalKwh)}
            tone="blue"
          />
          <SummaryRibbonItem
            label="Total RHrs"
            value={formatNumber(topMetrics.totalRhrs, 2)}
            tone="amber"
          />
          <SummaryRibbonItem
            label="Total Fuel"
            value={`${formatNumber(topMetrics.totalFuelKg)} kg`}
            tone="red"
          />
          <SummaryRibbonItem
            label="Running Engines"
            value={formatNumber(topMetrics.runningEngines)}
            tone="green"
          />
          <SummaryRibbonItem
            label="Running Mills"
            value={formatNumber(topMetrics.runningMills)}
            tone="blue"
          />
          <SummaryRibbonItem
            label="Avg Load"
            value={`${formatNumber(topMetrics.averageLoad, 0)} kW`}
            tone="purple"
          />
        </section>

        <div>
          <EngineSection
            engineStatus={engineStatus}
            generation={generation}
            engineMeterReadings={engineMeterReadings}
            fuelConsumption={fuelConsumption}
            now={now}
            compact
          />

          <MillSection
            millCurrentStatus={millCurrentStatus}
            millHistory={millHistory}
            now={now}
            compact
          />
        </div>
        <div className="operator-right1-column">
          <MillSummaryTable yesterdayMillSummary={yesterdayMillSummary} />

          <EquipmentSection
            boilerStatus={boilerStatus}
            roStatus={roStatus}
            fuelConsumption={fuelConsumption}
            compact
          />
        </div>
      </div>
    </div>
  );
}
