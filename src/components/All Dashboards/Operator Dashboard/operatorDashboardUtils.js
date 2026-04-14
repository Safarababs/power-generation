export const MILL_NAMES = ["CM1", "CM2", "CM3", "RM1", "RM2", "KILN1", "KILN2"];
export const ENGINE_NAMES = ["E1", "E2", "E3", "E4", "E5"];
export const BOILER_NAMES = ["BOILER-1", "BOILER-2"];
export const RO_NAMES = ["RO-1", "RO-2"];

export function getSafeDate(value) {
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

export function formatDateTime(value) {
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

export function formatShortDateTime(value) {
  const date = getSafeDate(value);
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatHours(value) {
  return `${formatNumber(value, 2)} hrs`;
}

export function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

export function getOperationalWindow(now = new Date()) {
  const current = new Date(now);
  const sixAMToday = new Date(current);
  sixAMToday.setHours(6, 0, 0, 0);

  let windowStart;
  let windowEnd;

  if (current >= sixAMToday) {
    windowStart = new Date(sixAMToday);
    windowEnd = new Date(sixAMToday);
    windowEnd.setDate(windowEnd.getDate() + 1);
  } else {
    windowEnd = new Date(sixAMToday);
    windowStart = new Date(sixAMToday);
    windowStart.setDate(windowStart.getDate() - 1);
  }

  return { windowStart, windowEnd };
}

export function getLastClosedOperationalWindow(now = new Date()) {
  const current = new Date(now);
  const sixAMToday = new Date(current);
  sixAMToday.setHours(6, 0, 0, 0);

  let end = new Date(sixAMToday);
  if (current < sixAMToday) {
    end = new Date(sixAMToday);
  }

  const start = new Date(end);
  start.setDate(start.getDate() - 1);

  return { start, end };
}

export function getFirestoreDayKeyForOperationalWindowEnd(dateObj) {
  const d = new Date(dateObj);
  return d.toISOString().split("T")[0];
}

export function hoursBetween(from, to) {
  const start = getSafeDate(from);
  const end = getSafeDate(to);
  if (!start || !end || end <= start) return 0;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

export function calculateMillLiveDuration(statusItem, now = new Date()) {
  if (!statusItem) {
    return {
      state: "STOPPED",
      hoursInWindow: 0,
      sinceLabel: "--",
    };
  }

  const { windowStart } = getOperationalWindow(now);
  const isRunning = Boolean(statusItem.currentlyRunning);
  const anchor = isRunning
    ? getSafeDate(statusItem.startTime)
    : getSafeDate(statusItem.stopTime || statusItem.startTime);

  if (!anchor) {
    return {
      state: isRunning ? "RUNNING" : "STOPPED",
      hoursInWindow: 0,
      sinceLabel: "--",
    };
  }

  const effectiveStart = anchor < windowStart ? windowStart : anchor;

  return {
    state: isRunning ? "RUNNING" : "STOPPED",
    hoursInWindow: hoursBetween(effectiveStart, now),
    sinceLabel: formatShortDateTime(anchor),
  };
}

export function getEngineCapacity(engineName, fuelItem = {}) {
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

export function getFuelTotals(consumption = []) {
  return consumption.reduce(
    (acc, item) => {
      acc.hfoKg += Number(item?.hfoKg || 0);
      acc.hfoLtr += Number(item?.hfoLtr || 0);
      acc.lfoKg += Number(item?.lfoKg || 0);
      acc.lfoLtr += Number(item?.lfoLtr || 0);
      acc.gasNm3 += Number(item?.gasNm3 || 0);
      acc.gasKg += Number(item?.gasKg || 0);
      return acc;
    },
    { hfoKg: 0, hfoLtr: 0, lfoKg: 0, lfoLtr: 0, gasNm3: 0, gasKg: 0 },
  );
}

export function getGenerationSummary(generation = [], fuelConsumption = []) {
  let totalKwh = 0;
  let totalRhrs = 0;
  let totalCapacityHours = 0;

  generation.forEach((gen, index) => {
    const kwh = Number(gen?.kwh || 0);
    const rhrs = Number(gen?.rhrs || 0);
    totalKwh += kwh;
    totalRhrs += rhrs;

    const engineName = ENGINE_NAMES[index];
    const capacity = getEngineCapacity(
      engineName,
      fuelConsumption[index] || {},
    );
    totalCapacityHours += capacity * rhrs;
  });

  return {
    totalKwh,
    totalRhrs,
    generationPercent:
      totalCapacityHours > 0 ? (totalKwh / totalCapacityHours) * 100 : 0,
    averageLoad: totalRhrs > 0 ? totalKwh / totalRhrs : 0,
  };
}

export function calculateCurrentEngineWindowHours(
  engineId,
  engineStatusMap = {},
  yesterdayGeneration = [],
  now = new Date(),
) {
  const status = engineStatusMap[engineId] || {};
  const { windowStart } = getOperationalWindow(now);
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

export function buildEngineCards(
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
      totalmeterRhrs: meterRhrs,
      windowHours: {
        ...windowHours,
        liveLifetimeRhrs: meterRhrs + windowHours.currentWindowHours,
      },
    };
  });
}

export function buildYesterdayMillSummary(
  millHistory = [],
  millCurrentStatus = {},
  now = new Date(),
) {
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
