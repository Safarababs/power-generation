import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import MillStatusBoard from "../../Daily Readings/Feeders Stoppage/MillStatusBoard";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CHART_COLORS = [
  "var(--primary-color)",
  "var(--success-color)",
  "var(--warning-color)",
  "var(--error-color)",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

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

function parseHours(record) {
  if (typeof record.totalStop === "number") return record.totalStop;

  if (typeof record.totalStop === "string") {
    const parsed = parseFloat(record.totalStop.replace(/[^\d.]/g, ""));
    if (!Number.isNaN(parsed)) return parsed;
  }

  const stopDate = getSafeDate(record.rawStop || record.stopTime);
  const startDate = getSafeDate(record.rawStart || record.startTime);

  if (stopDate && startDate && startDate >= stopDate) {
    return Number(
      ((startDate.getTime() - stopDate.getTime()) / (1000 * 60 * 60)).toFixed(
        2,
      ),
    );
  }

  return 0;
}

function normalizeRecord(record) {
  const stopDate = getSafeDate(record.rawStop || record.stopTime);
  const startDate = getSafeDate(record.rawStart || record.startTime);

  if (!stopDate) return null;

  const hours = parseHours(record);
  const year = stopDate.getFullYear();
  const monthIndex = stopDate.getMonth();
  const month = MONTH_NAMES[monthIndex];
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

  return {
    ...record,
    mill: record.mill || record.millName,
    stopDate,
    startDate,
    hours,
    year,
    monthIndex,
    month,
    monthKey,
    duplicateKey: `${record.mill || record.millName}__${record.rawStop || record.stopTime}__${record.rawStart || record.startTime}`,
  };
}

function formatHours(value) {
  return `${Number(value || 0).toFixed(2)} hrs`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return `${MONTH_NAMES[Number(month) - 1].slice(0, 3)}-${year}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="card shadow-md p-3" style={{ margin: 0 }}>
      <p className="text-sm font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toFixed(2)
            : entry.value}
        </p>
      ))}
    </div>
  );
}

function buildFirebaseStoppages(history = []) {
  const grouped = history.reduce((acc, item) => {
    const mill = item.millName;
    if (!mill) return acc;

    if (!acc[mill]) acc[mill] = [];
    acc[mill].push(item);
    return acc;
  }, {});

  const stoppages = [];

  Object.entries(grouped).forEach(([millName, records]) => {
    const sorted = [...records].sort((a, b) => {
      const aDate =
        getSafeDate(a.createdAt) ||
        getSafeDate(a.stopTime) ||
        getSafeDate(a.startTime) ||
        new Date(0);

      const bDate =
        getSafeDate(b.createdAt) ||
        getSafeDate(b.stopTime) ||
        getSafeDate(b.startTime) ||
        new Date(0);

      return aDate.getTime() - bDate.getTime();
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      const currentStopped = current.currentlyRunning === false;
      const nextStarted = next.currentlyRunning === true;

      if (!currentStopped || !nextStarted) continue;
      if (!current.stopTime || !next.startTime) continue;

      const stopDate = getSafeDate(current.stopTime);
      const startDate = getSafeDate(next.startTime);

      if (!stopDate || !startDate) continue;
      if (startDate <= stopDate) continue;

      stoppages.push({
        id: `${millName}-${current.stopTime}-${next.startTime}`,
        mill: millName,
        rawStop: current.stopTime,
        rawStart: next.startTime,
        stopTime: current.stopTime,
        startTime: next.startTime,
        source: "firebase",
      });
    }
  });

  return stoppages;
}

function mergeSummarySources(jsonData = [], firebaseHistory = []) {
  const firebaseStoppages = buildFirebaseStoppages(firebaseHistory);
  const combined = [...jsonData, ...firebaseStoppages];
  const seen = new Set();

  return combined.filter((item) => {
    const mill = item.mill || item.millName;
    const stop = item.rawStop || item.stopTime;
    const start = item.rawStart || item.startTime;
    const key = `${mill}__${stop}__${start}`;

    if (!mill || !stop || !start) return false;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export default function FeedersExecutiveSummary({ data = [] }) {
  const [firebaseHistory, setFirebaseHistory] = useState([]);
  const [filterType, setFilterType] = useState("yearly");
  const [month, setMonth] = useState("");
  const [mill, setMill] = useState("all");
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState();

  useEffect(() => {
    const q = query(
      collection(db, "millStatusHistory"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setFirebaseHistory(records);
    });

    return () => unsubscribe();
  }, []);

  const mergedSourceData = useMemo(() => {
    return mergeSummarySources(data || [], firebaseHistory || []);
  }, [data, firebaseHistory]);

  const records = useMemo(() => {
    const normalized = mergedSourceData
      .map(normalizeRecord)
      .filter(
        (item) =>
          item &&
          item.stopDate instanceof Date &&
          !Number.isNaN(item.stopDate.getTime()),
      )
      .sort((a, b) => a.stopDate.getTime() - b.stopDate.getTime());

    const seenDuplicateKeys = new Set();
    const lastOpenStopByMill = {};
    const cleaned = [];

    normalized.forEach((item) => {
      if (seenDuplicateKeys.has(item.duplicateKey)) {
        return;
      }
      seenDuplicateKeys.add(item.duplicateKey);

      const millKey = item.mill;
      const itemStop = item.stopDate.getTime();
      const itemStart = item.startDate?.getTime?.() ?? itemStop;
      const activeStop = lastOpenStopByMill[millKey];

      if (activeStop && itemStop < activeStop.startDate.getTime()) {
        return;
      }

      if (itemStart >= itemStop) {
        lastOpenStopByMill[millKey] = item;
        cleaned.push(item);
      }
    });

    return cleaned;
  }, [mergedSourceData]);

  const years = useMemo(() => {
    return Array.from(new Set(records.map((item) => String(item.year)))).sort();
  }, [records]);

  const mills = useMemo(() => {
    return Array.from(new Set(records.map((item) => item.mill))).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesYear = !year || String(item.year) === year;
      const matchesMonth = !month || item.monthKey === month;
      const matchesMill = mill === "all" || item.mill === mill;
      return matchesYear && matchesMonth && matchesMill;
    });
  }, [records, year, month, mill]);

  const summary = useMemo(() => {
    const totalHours = filteredRecords.reduce(
      (sum, item) => sum + item.hours,
      0,
    );
    const totalStops = filteredRecords.length;
    const averageHours = totalStops ? totalHours / totalStops : 0;

    const longestStop =
      [...filteredRecords].sort((a, b) => b.hours - a.hours)[0] || null;

    const millTotals = filteredRecords.reduce((acc, item) => {
      if (!acc[item.mill]) {
        acc[item.mill] = { mill: item.mill, hours: 0, stops: 0 };
      }
      acc[item.mill].hours += item.hours;
      acc[item.mill].stops += 1;
      return acc;
    }, {});

    const topMill =
      Object.values(millTotals).sort((a, b) => b.hours - a.hours)[0] || null;

    return {
      totalHours: Number(totalHours.toFixed(2)),
      totalStops,
      averageHours: Number(averageHours.toFixed(2)),
      longestStop,
      topMill,
    };
  }, [filteredRecords]);

  const yearlyEngineStyleChart = useMemo(() => {
    if (!year) return [];

    const months = Array.from({ length: 12 }, (_, index) => ({
      period: `${year}-${String(index + 1).padStart(2, "0")}`,
      monthLabel: MONTH_NAMES[index].slice(0, 3),
      stopHours: 0,
      stops: 0,
    }));

    filteredRecords.forEach((item) => {
      if (String(item.year) === year) {
        months[item.monthIndex].stopHours += item.hours;
        months[item.monthIndex].stops += 1;
      }
    });

    return months.map((item) => ({
      ...item,
      stopHours: Number(item.stopHours.toFixed(2)),
    }));
  }, [filteredRecords, year]);

  const monthlyMillChart = useMemo(() => {
    if (!month) return [];

    const grouped = filteredRecords.reduce((acc, item) => {
      if (!acc[item.mill]) {
        acc[item.mill] = {
          mill: item.mill,
          stopHours: 0,
          stops: 0,
        };
      }
      acc[item.mill].stopHours += item.hours;
      acc[item.mill].stops += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => b.stopHours - a.stopHours)
      .map((item) => ({
        ...item,
        stopHours: Number(item.stopHours.toFixed(2)),
      }));
  }, [filteredRecords, month]);

  const allYearSummaryChart = useMemo(() => {
    const grouped = filteredRecords.reduce((acc, item) => {
      const key = String(item.year);
      if (!acc[key]) {
        acc[key] = {
          period: key,
          stopHours: 0,
          stops: 0,
        };
      }
      acc[key].stopHours += item.hours;
      acc[key].stops += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((item) => ({
        ...item,
        stopHours: Number(item.stopHours.toFixed(2)),
      }));
  }, [filteredRecords]);

  const yearlyTrend = useMemo(() => {
    const grouped = filteredRecords.reduce((acc, item) => {
      if (!acc[item.monthKey]) {
        acc[item.monthKey] = {
          label: formatMonthLabel(item.monthKey),
          monthKey: item.monthKey,
          stopHours: 0,
          stops: 0,
        };
      }
      acc[item.monthKey].stopHours += item.hours;
      acc[item.monthKey].stops += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map((item) => ({
        ...item,
        stopHours: Number(item.stopHours.toFixed(2)),
      }));
  }, [filteredRecords]);

  const millShareData = useMemo(() => {
    const grouped = filteredRecords.reduce((acc, item) => {
      if (!acc[item.mill]) {
        acc[item.mill] = { name: item.mill, value: 0 };
      }
      acc[item.mill].value += item.hours;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => b.value - a.value)
      .map((item) => ({ ...item, value: Number(item.value.toFixed(2)) }));
  }, [filteredRecords]);

  const topRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => b.hours - a.hours).slice(0, 50);
  }, [filteredRecords]);

  const selectedYearlyTitle = year
    ? `Yearly Record - ${year}`
    : "Yearly Record";
  const selectedMonthTitle = month
    ? `Monthly Record - ${formatMonthLabel(month)}`
    : "Monthly Record";

  function formatReadableDateTime(value) {
    if (!value) return "--";

    const date =
      value?.toDate?.() || // Firestore Timestamp
      (value?.seconds ? new Date(value.seconds * 1000) : new Date(value));

    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <>
      <MillStatusBoard />

      <div className="card fade-in">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-2xl font-bold">Feeder's Executive Summary</h2>
        </div>

        <div className="card-content flex flex-wrap gap-3 items-center border-b">
          <div className="flex space-x-2">
            {["yearly", "monthly", "all"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn ${filterType === type ? "btn-primary" : ""}`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);

              if (
                month &&
                e.target.value &&
                !month.startsWith(e.target.value)
              ) {
                setMonth("");
              }
            }}
            className="form-select input-date"
          >
            <option value="">All Years</option>
            {/* Ensure current year always appears */}
            {!years.includes(currentYear) && (
              <option value={currentYear}>{currentYear}</option>
            )}
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="form-select input-date"
          >
            <option value="">All Months</option>
            {records
              .filter((item) => !year || String(item.year) === year)
              .map((item) => item.monthKey)
              .filter((value, index, array) => array.indexOf(value) === index)
              .sort()
              .map((item) => (
                <option key={item} value={item}>
                  {formatMonthLabel(item)}
                </option>
              ))}
          </select>

          <select
            value={mill}
            onChange={(e) => setMill(e.target.value)}
            className="form-select input-date"
          >
            <option value="all">All Mills</option>
            {mills.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="card-content">
          <div className="grid grid-cols-4 gap-4">
            <div className="card">
              <div className="card-content">
                <p className="text-sm text-secondary">Total Stop Hours</p>
                <h3 className="text-2xl font-bold text-blue mt-2">
                  {formatHours(summary.totalHours)}
                </h3>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <p className="text-sm text-secondary">Total Records</p>
                <h3 className="text-2xl font-bold text-green mt-2">
                  {summary.totalStops}
                </h3>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <p className="text-sm text-secondary">Average Stop</p>
                <h3 className="text-2xl font-bold text-yellow mt-2">
                  {formatHours(summary.averageHours)}
                </h3>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <p className="text-sm text-secondary">Top Mill</p>
                <h3 className="text-lg font-bold text-red mt-2">
                  {summary.topMill ? summary.topMill.mill : "No Data"}
                </h3>
                <p className="text-sm text-secondary mt-1">
                  {summary.topMill ? formatHours(summary.topMill.hours) : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {filterType === "yearly" &&
          year &&
          yearlyEngineStyleChart.length > 0 && (
            <div className="card-content chart-container">
              <h3 className="card-title mb-3">{selectedYearlyTitle}</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyEngineStyleChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis dataKey="monthLabel" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="stopHours"
                    name="Stop Hours"
                    fill="var(--error-color)"
                  />
                  <Bar
                    dataKey="stops"
                    name="Stop Count"
                    fill="var(--success-color)"
                  />
                  <Line
                    type="monotone"
                    dataKey="stopHours"
                    name="Hours Trend"
                    stroke="var(--error-color)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="stops"
                    name="Stops Trend"
                    stroke="var(--success-color)"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        {filterType === "monthly" && month && monthlyMillChart.length > 0 && (
          <div className="card-content chart-container">
            <h3 className="card-title mb-3">{selectedMonthTitle}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMillChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="mill" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="stopHours"
                  name="Stop Hours"
                  fill="var(--warning-color)"
                />
                <Bar
                  dataKey="stops"
                  name="Stop Count"
                  fill="var(--primary-color)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {filterType === "all" && allYearSummaryChart.length > 0 && (
          <div className="card-content chart-container">
            <h3 className="card-title mb-3">All Years Summary</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allYearSummaryChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="stopHours"
                  name="Stop Hours"
                  fill="var(--primary-color)"
                />
                <Bar
                  dataKey="stops"
                  name="Stop Count"
                  fill="var(--success-color)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card-content">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Monthly Trend</h3>
              </div>
              <div className="card-content chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                    />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stopHours"
                      name="Stop Hours"
                      stroke="var(--primary-color)"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="stops"
                      name="Stop Count"
                      stroke="var(--success-color)"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Mill Share by Stop Hours</h3>
              </div>
              <div className="card-content chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={millShareData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={85}
                      label
                    >
                      {millShareData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card-content overflow-x-auto">
          <div className="alert alert-success">
            <strong>⛔Longest Stop:</strong>{" "}
            {summary.longestStop
              ? `${summary.longestStop.mill} - ${formatHours(summary.longestStop.hours)} - ${summary.longestStop.month} ${summary.longestStop.year}`
              : "No record found"}
          </div>

          <div className="alert alert-info">
            <strong>Note:</strong> If a mill stopped and started in the next
            month, it is counted as a stop for the month it stopped.
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Mill</th>
                <th>Year</th>
                <th>Month</th>
                <th className="text-red">Stop Hours</th>
                <th>Stop Time</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {topRecords
                .filter((item) => item.source === "firebase")
                .sort((a, b) => {
                  const aTime = new Date(a.rawStop || a.stopTime).getTime();
                  const bTime = new Date(b.rawStop || b.stopTime).getTime();
                  return bTime - aTime;
                })
                .slice(0, 10)
                .map((item, index) => (
                  <tr key={item.id || item.duplicateKey}>
                    <td>{index + 1}</td>
                    <td>{item.mill}</td>
                    <td>{item.year}</td>
                    <td>{item.month}</td>
                    <td className="text-red font-semibold">
                      {formatHours(item.hours)}
                    </td>
                    <td>
                      {formatReadableDateTime(item.rawStop || item.stopTime)}
                    </td>
                    <td>
                      {formatReadableDateTime(item.rawStart || item.startTime)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
