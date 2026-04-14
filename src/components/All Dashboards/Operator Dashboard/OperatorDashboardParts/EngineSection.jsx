import React, { useMemo } from "react";

const ENGINE_NAMES = ["E1", "E2", "E3", "E4", "E5"];

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

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
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

function hoursBetween(from, to) {
  const start = getSafeDate(from);
  const end = getSafeDate(to);
  if (!start || !end || end <= start) return 0;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

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

function calculateCurrentEngineWindowHours(
  engineId,
  engineStatusMap = {},
  yesterdayGeneration = [],
  now = new Date(),
) {
  const status = engineStatusMap[engineId] || {};
  const { start: windowStart } = getCurrentOperationalWindow(now);
  const isRunning = status.currentStatus === "running";
  const lastEventTime = getSafeDate(status.lastEventTime);
  const yesterdayIndex = ENGINE_NAMES.indexOf(engineId);
  const closedWindowRhrs = Number(
    yesterdayGeneration?.[yesterdayIndex]?.rhrs || 0,
  );

  if (!lastEventTime) {
    return {
      state: isRunning ? "RUNNING" : "STOPPED",
      currentWindowHours: 0,
      yesterdayClosedRhrs: closedWindowRhrs,
      totalDisplayHours: closedWindowRhrs,
      sinceLabel: "--",
    };
  }

  const effectiveStart =
    lastEventTime < windowStart ? windowStart : lastEventTime;

  const endTime = isRunning ? now : lastEventTime;
  const currentWindowHours = hoursBetween(effectiveStart, endTime);

  return {
    state: isRunning ? "RUNNING" : "STOPPED",
    currentWindowHours,
    yesterdayClosedRhrs: closedWindowRhrs,
    totalDisplayHours: closedWindowRhrs + currentWindowHours,
    sinceLabel: formatShortDateTime(lastEventTime),
  };
}

function buildEngineCards(
  engineStatusMap = {},
  fuelConsumption = [],
  generation = [],
  meterReadings = [],
  now = new Date(),
) {
  return ENGINE_NAMES.map((engineId, index) => {
    const live = engineStatusMap[engineId] || {};
    const fuel = fuelConsumption[index] || {};
    const gen = generation[index] || {};
    const meter = meterReadings[index] || {};

    const capacity = getEngineCapacity(engineId, fuel);
    const rhrs = Number(gen.rhrs || 0);
    const kwh = Number(gen.kwh || 0);
    const avgLoad = rhrs > 0 ? kwh / rhrs : 0;
    const meterRhrs = Number(meter.rhrs || 0);

    const windowHours = calculateCurrentEngineWindowHours(
      engineId,
      engineStatusMap,
      generation,
      now,
    );

    return {
      engineId,
      currentStatus: live.currentStatus || "stopped",
      lastEventTime: live.lastEventTime || null,
      fuel,
      generation: gen,
      capacity,
      avgLoad,
      totalMeterRhrs: meterRhrs,
      windowHours: {
        ...windowHours,
        liveLifetimeRhrs: meterRhrs + windowHours.currentWindowHours,
      },
    };
  });
}

function EngineTile({ item, compact }) {
  const running = item.currentStatus === "running";

  return (
    <div
      className={`operator-status-tile engine-tile ${running ? "is-running" : "is-stopped"} ${
        compact ? "compact-tile" : ""
      }`}
    >
      <div className="tile-top">
        <h4>{item.engineId}</h4>
        <span
          className={`status-badge ${running ? "status-online" : "status-critical"}`}
        >
          {running ? "RUNNING" : "STOPPED"}
        </span>
      </div>

      <div className="tile-main-value">
        {formatNumber(item.windowHours.currentWindowHours, 2)} hrs
      </div>

      <div className="tile-grid">
        <div>
          <span>Life RHrs</span>
          <strong>{formatNumber(item.windowHours.liveLifetimeRhrs, 2)}</strong>
        </div>
        <div>
          <span>Yest KWH</span>
          <strong>{formatNumber(item.generation.kwh)}</strong>
        </div>
        <div>
          <span>Meter RHrs</span>
          <strong>{formatNumber(item.totalMeterRhrs, 2)}</strong>
        </div>
        <div>
          <span>Cap.</span>
          <strong>{formatNumber(item.capacity)} kW</strong>
        </div>
      </div>

      <div className="tile-sub-line">
        Fuel: HFO {formatNumber(item.fuel.hfoKg)} kg
        {(item.engineId === "E4" || item.engineId === "E5") && (
          <> | Gas {formatNumber(item.fuel.gasNm3)} Nm³</>
        )}
      </div>

      <div className="tile-sub-line">
        Last: {formatDateTime(item.lastEventTime)} | Since:{" "}
        {item.windowHours.sinceLabel}
      </div>
    </div>
  );
}

export default function EngineSection({
  engineStatus,
  generation,
  engineMeterReadings,
  fuelConsumption,
  now,
  compact = false,
}) {
  const engineCards = useMemo(() => {
    return buildEngineCards(
      engineStatus,
      fuelConsumption,
      generation,
      engineMeterReadings,
      now,
    );
  }, [engineStatus, fuelConsumption, generation, engineMeterReadings, now]);

  return (
    <section className="card operator-panel-card operator-engines-compact-section">
      <div className="card-header compact-section-header">
        <h3 className="card-title">Engines Live Matrix</h3>
      </div>
      <div className="card-content operator-matrix-grid engines-matrix-grid">
        {engineCards.map((item) => (
          <EngineTile key={item.engineId} item={item} compact={compact} />
        ))}
      </div>
    </section>
  );
}
