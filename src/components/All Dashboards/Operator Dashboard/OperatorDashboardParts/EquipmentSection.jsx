import React, { useMemo } from "react";
const BOILER_NAMES = ["BOILER-1", "BOILER-2"];
const RO_NAMES = ["RO-1", "RO-2"];

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function MiniStatusPill({ label, active }) {
  return (
    <span
      className={`status-badge ${active ? "status-online" : "status-offline"}`}
    >
      {label}
    </span>
  );
}

function StatusListCard({ title, items }) {
  return (
    <div className="card operator-panel-card compact-side-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content compact-side-list">
        {items.map((item) => {
          const active =
            item.currentStatus === "running" ||
            item.currentStatus === "online" ||
            item.currentStatus === "healthy";

          return (
            <div key={item.name} className="operator-simple-row">
              <span>{item.name}</span>
              <MiniStatusPill
                label={(item.currentStatus || "no data").toUpperCase()}
                active={active}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FuelCompactCard({ fuelTotals }) {
  const totalFuel =
    Number(fuelTotals.hfoKg || 0) +
    Number(fuelTotals.lfoKg || 0) +
    Number(fuelTotals.gasKg || 0);

  const fuelItems = [
    {
      label: "HFO",
      value: formatNumber(fuelTotals.hfoKg),
      unit: "kg",
      tone: "red",
    },
    {
      label: "LFO",
      value: formatNumber(fuelTotals.lfoLtr),
      unit: "ltr",
      tone: "amber",
    },
    {
      label: "Gas Nm³",
      value: formatNumber(fuelTotals.gasNm3),
      unit: "Nm³",
      tone: "blue",
    },
    {
      label: "Gas Kg",
      value: formatNumber(fuelTotals.gasKg),
      unit: "kg",
      tone: "green",
    },
  ];

  return (
    <div className="card operator-panel-card compact-side-card fuel-summary-card">
      <div className="card-header">
        <h3 className="card-title">Fuel Summary</h3>
      </div>

      <div className="card-content fuel-summary-wrapper">
        {/* 🔥 TOTAL FUEL BAR */}
        <div className="fuel-total-bar">
          <span>Total Fuel (All Engines)</span>
          <strong>{formatNumber(totalFuel)} kg</strong>
        </div>

        {/* 🔥 FUEL GRID */}
        <div className="fuel-grid">
          {fuelItems.map((item) => (
            <div key={item.label} className={`fuel-tile fuel-${item.tone}`}>
              <span className="fuel-label">{item.label}</span>
              <strong className="fuel-value">{item.value}</strong>
              <small className="fuel-unit">{item.unit}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EquipmentSection({
  boilerStatus,
  roStatus,
  fuelConsumption,
}) {
  const boilerCards = useMemo(() => {
    return BOILER_NAMES.map((name) => ({
      name,
      currentStatus: boilerStatus[name]?.currentStatus || "no data",
    }));
  }, [boilerStatus]);

  const roCards = useMemo(() => {
    return RO_NAMES.map((name) => ({
      name,
      currentStatus: roStatus[name]?.currentStatus || "no data",
    }));
  }, [roStatus]);

  const fuelTotals = useMemo(() => {
    return fuelConsumption.reduce(
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
  }, [fuelConsumption]);

  return (
    <section className="operator-side-stack compact-side-stack">
      {/* <StatusListCard title="Boilers" items={boilerCards} /> */}
      {/* <StatusListCard title="RO Plant" items={roCards} /> */}
      <FuelCompactCard fuelTotals={fuelTotals} />
    </section>
  );
}
