import React, { useMemo } from "react";

const MILL_NAMES = ["CM1", "CM2", "CM3", "RM1", "RM2", "KILN1", "KILN2"];

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

function formatHours(value) {
  return `${formatNumber(value, 2)} hrs`;
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

function SummaryChip({ title, value, tone = "blue" }) {
  return (
    <div className={`operator-chip tone-${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MillLiveCard({ item, compact }) {
  const running = item.state === "RUNNING";

  return (
    <div
      className={`operator-status-tile mill-tile ${running ? "is-running" : "is-stopped"} ${
        compact ? "compact-tile" : ""
      }`}
    >
      <div className="tile-top">
        <h4>{item.name}</h4>
        <span
          className={`status-badge ${running ? "status-online" : "status-critical"}`}
        >
          {item.state}
        </span>
      </div>

      <div className="tile-main-value">{formatHours(item.hoursInWindow)}</div>
      <div className="tile-sub-line">
        {running ? "Current running hours" : "Current stopped hours"}
      </div>
      <div className="tile-sub-line">Since: {item.sinceLabel}</div>
    </div>
  );
}

function calculateMillLiveDuration(statusItem, now = new Date()) {
  if (!statusItem) {
    return {
      state: "STOPPED",
      hoursInWindow: 0,
      sinceLabel: "--",
    };
  }

  const { start: windowStart } = getCurrentOperationalWindow(now);
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

export default function MillSection({
  millCurrentStatus,
  now,
  compact = false,
}) {
  const millCards = useMemo(() => {
    return MILL_NAMES.map((name) => {
      const status = millCurrentStatus[name] || null;
      const derived = calculateMillLiveDuration(status, now);
      return {
        name,
        ...derived,
      };
    });
  }, [millCurrentStatus, now]);

  const runningCount = useMemo(() => {
    return millCards.filter((item) => item.state === "RUNNING").length;
  }, [millCards]);

  const stoppedCount = millCards.length - runningCount;

  const totalWindowHours = useMemo(() => {
    return millCards.reduce((sum, item) => sum + item.hoursInWindow, 0);
  }, [millCards]);

  return (
    <section className="card operator-panel-card operator-mills-compact-section">
      <div className="card-header compact-section-header">
        <h3 className="card-title">Mills Live Matrix</h3>
        <div className="operator-chip-row">
          <SummaryChip
            title="Window Hours"
            value={formatHours(totalWindowHours)}
            tone="red"
          />
          <SummaryChip
            title="Running"
            value={formatNumber(runningCount)}
            tone="green"
          />
          <SummaryChip
            title="Stopped"
            value={formatNumber(stoppedCount)}
            tone="amber"
          />
        </div>
      </div>

      <div className="card-content operator-matrix-grid mills-matrix-grid">
        {millCards.map((item) => (
          <MillLiveCard key={item.name} item={item} compact={compact} />
        ))}
      </div>
    </section>
  );
}
