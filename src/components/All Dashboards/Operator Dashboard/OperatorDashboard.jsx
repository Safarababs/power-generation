import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import "./operatorDashboard.css";

const MILL_NAMES = ["KILN1", "KILN2", "CM1", "CM2", "CM3", "RM1", "RM2"];
const ENGINE_NAMES = ["E1", "E2", "E3", "E4", "E5"];
const BOILER_NAMES = ["BOILER-1", "BOILER-2"];
const RO_NAMES = ["RO-1", "RO-2"];

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

function formatDate(value) {
  const date = getSafeDate(value);
  if (!date) return "--";
  return date.toLocaleDateString("en-GB");
}

function formatTime(value) {
  const date = getSafeDate(value);
  if (!date) return "--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

function formatHours(value) {
  return `${formatNumber(value, 2)} hrs`;
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

function getLastClosedOperationalWindow(now = new Date()) {
  const current = new Date(now);
  const sixAMToday = new Date(current);
  sixAMToday.setHours(6, 0, 0, 0);

  const end = new Date(sixAMToday);
  const start = new Date(end);
  start.setDate(start.getDate() - 1);

  return { start, end };
}

function getOperationalEntryDateKey(now = new Date()) {
  const { start } = getLastClosedOperationalWindow(now);
  return start.toISOString().split("T")[0];
}

function getEngineCapacity(engineName, fuelItem = {}) {
  if (engineName === "E1" || engineName === "E2" || engineName === "E3") {
    return 9780;
  }

  if (engineName === "E4" || engineName === "E5") {
    const gasNm3 = Number(fuelItem?.gasNm3 || 0);
    const gasKg = Number(fuelItem?.gasKg || 0);
    const gasMode = gasNm3 <= 0 && gasKg <= 0;
    return gasMode ? 9766 : 8997;
  }

  return 0;
}

function SummaryBox({ label, value, tone = "blue" }) {
  return (
    <div className={`operator-summary-box tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBoard({ title, items }) {
  return (
    <section className="card operator-simple-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content operator-board-wrap">
        {items.map((item) => {
          const isRunning = item.status === "running";

          return (
            <div
              key={item.id}
              className={`operator-status-box ${
                isRunning
                  ? "operator-status-running"
                  : "operator-status-stopped"
              }`}
            >
              <h3 className="operator-box-title">{item.name}</h3>

              <p className="operator-box-status">
                {isRunning ? "RUNNING" : "STOPPED"}
              </p>

              <small className="operator-box-line">
                Since: {item.sinceDate}
              </small>
              <small className="operator-box-line">{item.sinceTime}</small>

              {item.lifetimeHours ? (
                <small className="operator-box-line operator-box-hours">
                  Rhrs: {item.lifetimeHours}
                </small>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SimpleTable({ title, headers, rows, emptyText = "No data found." }) {
  return (
    <section className="card operator-simple-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content operator-simple-table-wrap">
        <table className="table operator-simple-table">
          <thead>
            <tr>
              {headers.map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center text-secondary"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
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

  const generation = useMemo(
    () => generationDoc?.generation ?? [],
    [generationDoc],
  );
  const engineMeterReadings = useMemo(
    () => generationDoc?.readings ?? [],
    [generationDoc],
  );
  const fuelConsumption = useMemo(() => fuelDoc?.consumption ?? [], [fuelDoc]);

  const topMetrics = useMemo(() => {
    let totalKwh = 0;
    let totalRhrs = 0;
    let totalCapacityHours = 0;
    let totalFuelKg = 0;

    generation.forEach((item, index) => {
      const kwh = Number(item?.kwh || 0);
      const rhrs = Number(item?.rhrs || 0);
      const capacity = getEngineCapacity(
        ENGINE_NAMES[index],
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

    return {
      totalKwh,
      totalRhrs,
      generationPercent:
        totalCapacityHours > 0 ? (totalKwh / totalCapacityHours) * 100 : 0,
      totalFuelKg,
      runningMills: Object.values(millCurrentStatus).filter(
        (item) => item?.currentlyRunning === true,
      ).length,
      runningEngines: Object.values(engineStatus).filter(
        (item) => item?.currentStatus === "running",
      ).length,
    };
  }, [generation, fuelConsumption, millCurrentStatus, engineStatus]);

  const millBoardItems = useMemo(() => {
    return MILL_NAMES.map((millName) => {
      const mill = millCurrentStatus[millName] || {};
      const running = Boolean(mill.currentlyRunning);
      const anchor = running
        ? getSafeDate(mill.startTime)
        : getSafeDate(mill.stopTime || mill.startTime);

      const effectiveStart =
        anchor && anchor < currentWindow.start ? currentWindow.start : anchor;

      return {
        id: millName,
        name: millName,
        status: running ? "running" : "stopped",
        sinceDate: formatDate(anchor),
        sinceTime: formatTime(anchor),
        hoursLabel: effectiveStart
          ? `${running ? "Running" : "Stopped"}: ${formatHours(hoursBetween(effectiveStart, now))}`
          : "--",
      };
    });
  }, [millCurrentStatus, currentWindow.start, now]);

  const engineBoardItems = useMemo(() => {
    return ENGINE_NAMES.map((engineId, index) => {
      const engine = engineStatus[engineId] || {};
      const running = engine.currentStatus === "running";
      const lastEvent = getSafeDate(engine.lastEventTime);
      const effectiveStart =
        lastEvent && lastEvent < currentWindow.start
          ? currentWindow.start
          : lastEvent;
      const endTime = running ? now : lastEvent;

      // life time hours from meter reading + current window hours if running
      const currentWindowHours =
        effectiveStart && endTime ? hoursBetween(effectiveStart, endTime) : 0;

      const lifetimeHours = engineMeterReadings[index]?.rhrs || 0;

      const totalHours = running
        ? lifetimeHours + currentWindowHours
        : lifetimeHours;

      return {
        id: engineId,
        name: engineId,
        status: running ? "running" : "stopped",
        sinceDate: formatDate(lastEvent),
        sinceTime: formatTime(lastEvent),
        lifetimeHours: totalHours > 0 ? formatHours(totalHours) : null,
        hoursLabel:
          effectiveStart && endTime
            ? `${running ? "RHrs" : "Stopped"}: ${formatHours(hoursBetween(effectiveStart, endTime))}`
            : "--",
      };
    });
  }, [engineStatus, currentWindow.start, now, engineMeterReadings]);

  const yesterdayPowerRows = useMemo(() => {
    return ENGINE_NAMES.map((engineId, index) => {
      const gen = generation[index] || {};
      const meter = engineMeterReadings[index] || {};
      const fuel = fuelConsumption[index] || {};

      return [
        engineId,
        formatNumber(gen.kwh),
        formatNumber(gen.rhrs, 2),
        formatNumber(meter.rhrs, 2),
        `${formatNumber(getEngineCapacity(engineId, fuel))} kW`,
      ];
    });
  }, [generation, engineMeterReadings, fuelConsumption]);

  const yesterdayMillRows = useMemo(() => {
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

      const runningHours = Math.max(0, 24 - totalStoppedHours);
      const current = millCurrentStatus[millName] || {};
      const currentRunning = Boolean(current.currentlyRunning);

      return [
        millName,
        formatHours(totalStoppedHours),
        formatHours(runningHours),
        currentRunning ? "RUNNING" : "STOPPED",
        currentRunning
          ? formatShortDateTime(current.startTime)
          : formatShortDateTime(current.stopTime || current.startTime),
      ];
    });
  }, [millHistory, millCurrentStatus, now]);

  const utilityRows = useMemo(() => {
    const boilerRow = BOILER_NAMES.map(
      (name) =>
        `${name}: ${(boilerStatus[name]?.currentStatus || "NO DATA").toUpperCase()}`,
    ).join(" | ");

    const roRow = RO_NAMES.map(
      (name) =>
        `${name}: ${(roStatus[name]?.currentStatus || "NO DATA").toUpperCase()}`,
    ).join(" | ");

    let totalHfoKg = 0;
    let totalLfoLtr = 0;
    let totalGasNm3 = 0;
    let totalGasKg = 0;

    fuelConsumption.forEach((item) => {
      totalHfoKg += Number(item?.hfoKg || 0);
      totalLfoLtr += Number(item?.lfoLtr || 0);
      totalGasNm3 += Number(item?.gasNm3 || 0);
      totalGasKg += Number(item?.gasKg || 0);
    });

    return [
      ["Boilers", boilerRow],
      ["RO Plant", roRow],
      ["HFO", `${formatNumber(totalHfoKg)} kg`],
      ["LFO", `${formatNumber(totalLfoLtr)} ltr`],
      ["Gas Nm³", formatNumber(totalGasNm3)],
      ["Gas Kg", `${formatNumber(totalGasKg)} kg`],
    ];
  }, [boilerStatus, roStatus, fuelConsumption]);

  return (
    <div className="operator-dashboard-page operator-clear-page">
      <div className="operator-clear-layout">
        <section className="card operator-clear-header">
          <div className="card-content operator-clear-header-content">
            <div>
              <h1 className="operator-page-title">PG-IPS</h1>
              <p className="operator-page-subtitle">Centeral Command Screen</p>
            </div>

            <div className="operator-window-text">
              <div>
                {/* <span>Current Window</span> */}
                <strong>
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {formatTime(now)}
                  {/* {formatShortDateTime(currentWindow.start)} →{" "}
                  {formatShortDateTime(currentWindow.end)} */}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="operator-clear-summary">
          <SummaryBox
            label="Running Engines"
            value={formatNumber(topMetrics.runningEngines)}
            tone="green"
          />
          <SummaryBox
            label="Running Mills"
            value={formatNumber(topMetrics.runningMills)}
            tone="blue"
          />

          <SummaryBox
            label="Generation %"
            value={formatPercent(topMetrics.generationPercent)}
            tone="green"
          />
          <SummaryBox
            label="Total KWH"
            value={formatNumber(topMetrics.totalKwh)}
            tone="blue"
          />
          <SummaryBox
            label="Total RHrs"
            value={formatNumber(topMetrics.totalRhrs, 2)}
            tone="amber"
          />
          <SummaryBox
            label="Total Fuel"
            value={`${formatNumber(topMetrics.totalFuelKg)} kg`}
            tone="red"
          />
        </section>

        <StatusBoard title="Engines Live Status" items={engineBoardItems} />
        <StatusBoard title="Mills Live Status" items={millBoardItems} />

        <div className="operator-bottom-grid">
          <SimpleTable
            title="Yesterday Power Summary"
            headers={["Engine", "KWH", "RHrs", "Total RHrs", "Capacity"]}
            rows={yesterdayPowerRows}
          />

          <SimpleTable
            title="Yesterday Mill Summary"
            headers={["Mill", "Stop Hrs", "Run Hrs", "Status", "Since"]}
            rows={yesterdayMillRows}
          />

          <SimpleTable
            title="Utilities & Fuel"
            headers={["Item", "Value"]}
            rows={utilityRows}
          />
        </div>
      </div>
    </div>
  );
}
