export const ENGINE_KEYS = ["dg1", "dg2", "dg3", "dg4", "dg5", "cat", "volvo"];
export const DG_KEYS = ["dg1", "dg2", "dg3", "dg4", "dg5"];

export const ENGINE_LABELS = {
  dg1: "DG 1",
  dg2: "DG 2",
  dg3: "DG 3",
  dg4: "DG 4",
  dg5: "DG 5",
  cat: "CAT",
  volvo: "VOLVO",
};

export const ALL_LUBE_KEYS = [
  "ti4040",
  "ti4020",
  "shellArginaS5Bn55",
  "shellArginaS4Bn40",
];

// TI4040 is historical only now.
export const ACTIVE_LUBE_KEYS = [
  "ti4020",
  "shellArginaS5Bn55",
  "shellArginaS4Bn40",
];

export const LUBE_LABELS = {
  ti4040: "TI4040 (Inactive / Historical)",
  ti4020: "TI4020",
  shellArginaS5Bn55: "Shell Argina S5 BN55",
  shellArginaS4Bn40: "Shell Argina S4 BN40",
};

export const EXECUTIVE_COLORS = {
  hfo: "#1e3a8a",
  lfo: "#047857",
  gas: "#334155",
  energy: "#2563eb",
  runningHours: "#7c3aed",
  consumption: "#ea580c",
  closing: "#16a34a",
  transfer: "#dc2626",
  ti4040: "#f59e0b",
  ti4020: "#7c3aed",
  shellArginaS5Bn55: "#ef4444",
  shellArginaS4Bn40: "#0f766e",
};

export const MACHINE_COLORS = {
  dg1: "#2563eb",
  dg2: "#16a34a",
  dg3: "#f97316",
  dg4: "#7c3aed",
  dg5: "#dc2626",
  cat: "#0f766e",
  volvo: "#475569",
};

export const numberValue = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatNumber = (value) =>
  new Intl.NumberFormat().format(numberValue(value));

export const formatDecimal = (value, digits = 2) =>
  numberValue(value).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const emptyLubeUsage = () => ({
  ti4040: { topup: 0, replace: 0, total: 0 },
  ti4020: { topup: 0, replace: 0, total: 0 },
  shellArginaS5Bn55: { topup: 0, replace: 0, total: 0 },
  shellArginaS4Bn40: { topup: 0, replace: 0, total: 0 },
});

const normalizeOil = (oil = {}) => {
  const normalized = {
    opening: numberValue(oil.opening),
    received: numberValue(oil.received),
    transferredToCement: numberValue(oil.transferredToCement),
    dgSets: numberValue(oil.dgSets),
    bs: numberValue(oil.bs),
    volvo: numberValue(oil.volvo),
    cat: numberValue(oil.cat),
    boilers: numberValue(oil.boilers),
    closing: numberValue(oil.closing),
    totalConsumption: numberValue(oil.totalConsumption),
  };

  if (!normalized.totalConsumption) {
    normalized.totalConsumption =
      normalized.transferredToCement +
      normalized.dgSets +
      normalized.bs +
      normalized.volvo +
      normalized.cat +
      normalized.boilers;
  }

  return normalized;
};

const addLubeUsage = (usage, key, topup, replace) => {
  if (!usage[key]) return;

  usage[key].topup += numberValue(topup);
  usage[key].replace += numberValue(replace);
  usage[key].total = usage[key].topup + usage[key].replace;
};

const normalizeMachine = (engineKey, engine = {}) => {
  const lubeUsage = emptyLubeUsage();

  if (engine.lubeUsage) {
    ALL_LUBE_KEYS.forEach((key) => {
      addLubeUsage(
        lubeUsage,
        key,
        engine.lubeUsage?.[key]?.topup,
        engine.lubeUsage?.[key]?.replace,
      );
    });
  } else if (engine.lubeOilType) {
    addLubeUsage(
      lubeUsage,
      engine.lubeOilType,
      engine.lubeTopup,
      engine.lubeReplace,
    );
  } else if (engine.lubeTopup || engine.lubeReplace) {
    const fallbackKey = ["dg4", "dg5"].includes(engineKey)
      ? "ti4020"
      : "ti4040";
    addLubeUsage(lubeUsage, fallbackKey, engine.lubeTopup, engine.lubeReplace);
  }

  const lubeTotal = ALL_LUBE_KEYS.reduce(
    (sum, key) => sum + lubeUsage[key].total,
    0,
  );

  return {
    fuelMode: engine.fuelMode || "hfoLfo",
    monthHours: numberValue(engine.monthHours),
    totalHours: numberValue(engine.totalHours),
    generation: numberValue(engine.generation),
    hfo: numberValue(engine.hfo),
    lfo: numberValue(engine.lfo),
    efficiency: numberValue(engine.efficiency),
    lubeUsage,
    lubeTotal,
  };
};

const normalizeLubeOils = (rawOils = {}) => {
  const lubeOil = {
    ti4040: normalizeOil(rawOils.ti4040),
    ti4020: normalizeOil(rawOils.ti4020),
    shellArginaS5Bn55: normalizeOil(rawOils.shellArginaS5Bn55),
    shellArginaS4Bn40: normalizeOil(rawOils.shellArginaS4Bn40),
  };

  const hasNewLube = ALL_LUBE_KEYS.some(
    (key) =>
      lubeOil[key].opening ||
      lubeOil[key].received ||
      lubeOil[key].closing ||
      lubeOil[key].totalConsumption,
  );

  if (!hasNewLube && rawOils.lubeOil) {
    lubeOil.ti4040 = {
      ...normalizeOil(rawOils.lubeOil),
      legacySource: true,
    };
  }

  const total = {
    opening: ALL_LUBE_KEYS.reduce((sum, key) => sum + lubeOil[key].opening, 0),
    received: ALL_LUBE_KEYS.reduce(
      (sum, key) => sum + lubeOil[key].received,
      0,
    ),
    closing: ALL_LUBE_KEYS.reduce((sum, key) => sum + lubeOil[key].closing, 0),
    totalConsumption: ALL_LUBE_KEYS.reduce(
      (sum, key) => sum + lubeOil[key].totalConsumption,
      0,
    ),
  };

  return { ...lubeOil, total };
};

export const normalizeMonthlyReport = (rawReport = {}) => {
  const machines = ENGINE_KEYS.reduce((acc, engineKey) => {
    acc[engineKey] = normalizeMachine(
      engineKey,
      rawReport.machines?.[engineKey],
    );
    return acc;
  }, {});

  const totalMachineGeneration = ENGINE_KEYS.reduce(
    (sum, key) => sum + machines[key].generation,
    0,
  );

  const totalRunningHours = ENGINE_KEYS.reduce(
    (sum, key) => sum + machines[key].monthHours,
    0,
  );

  const energy = {
    generated:
      numberValue(rawReport.energy?.generated) || totalMachineGeneration,
    exported: numberValue(rawReport.energy?.exported),
    inHouse: numberValue(rawReport.energy?.inHouse),
    roConsumption: numberValue(rawReport.energy?.roConsumption),
    gasGenerationKwh: numberValue(rawReport.energy?.gasGenerationKwh),
    gasConsumptionNm3: numberValue(rawReport.energy?.gasConsumptionNm3),
    hfoGenerationKwh: numberValue(rawReport.energy?.hfoGenerationKwh),
    gasSfocNm3PerKwh: numberValue(rawReport.energy?.gasSfocNm3PerKwh),
  };

  if (!energy.hfoGenerationKwh && energy.generated) {
    energy.hfoGenerationKwh = Math.max(
      energy.generated - energy.gasGenerationKwh,
      0,
    );
  }

  if (!energy.gasSfocNm3PerKwh && energy.gasGenerationKwh > 0) {
    energy.gasSfocNm3PerKwh =
      energy.gasConsumptionNm3 / energy.gasGenerationKwh;
  }

  return {
    id:
      rawReport.id ||
      rawReport.monthKey ||
      `${rawReport.year}-${rawReport.month}`,
    monthKey: rawReport.monthKey || `${rawReport.year}-${rawReport.month}`,
    year: String(rawReport.year || rawReport.monthKey?.slice(0, 4) || ""),
    month: String(rawReport.month || rawReport.monthKey?.slice(5, 7) || ""),
    dataVersion: rawReport.dataVersion || "legacy",
    machines,
    energy,
    performance: {
      sfoc: numberValue(rawReport.performance?.sfoc),
      sloc: numberValue(rawReport.performance?.sloc),
    },
    roWater: {
      produced: numberValue(rawReport.roWater?.produced),
      exported: numberValue(rawReport.roWater?.exported),
    },
    oils: {
      hfo: normalizeOil(rawReport.oils?.hfo),
      lfo: normalizeOil(rawReport.oils?.lfo),
      lubeOil: normalizeLubeOils(rawReport.oils || {}),
    },
    totals: {
      totalMachineGeneration,
      totalRunningHours,
      dgGeneration: DG_KEYS.reduce(
        (sum, key) => sum + machines[key].generation,
        0,
      ),
      dgRunningHours: DG_KEYS.reduce(
        (sum, key) => sum + machines[key].monthHours,
        0,
      ),
      totalLubeConsumptionByEngines: ENGINE_KEYS.reduce(
        (sum, key) => sum + machines[key].lubeTotal,
        0,
      ),
    },
    remarks: rawReport.remarks || "",
  };
};

export async function loadMonthlyReportsFromJson(
  path = "/data/monthly-fuel-reports-normalized.json",
) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load JSON file: ${path}`);

  const json = await response.json();
  const rawReports = Array.isArray(json) ? json : json.reports || [];

  return rawReports
    .map(normalizeMonthlyReport)
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function getAvailableYears(reports) {
  return [
    ...new Set(reports.map((report) => report.year).filter(Boolean)),
  ].sort();
}

export function filterExecutiveReports(reports, filters) {
  return reports.filter((report) => {
    if (filters.year !== "all" && report.year !== filters.year) return false;
    if (filters.month !== "all" && report.month !== filters.month) return false;
    return true;
  });
}

function getSelectedEngineKeys(engine) {
  return engine === "all" ? ENGINE_KEYS : [engine];
}

export function summarizeExecutiveData(
  reports = [],
  filters = { engine: "all" },
) {
  const selectedEngineKeys = getSelectedEngineKeys(filters.engine || "all");

  const byMachineAll = ENGINE_KEYS.map((engineKey) => ({
    key: engineKey,
    name: ENGINE_LABELS[engineKey],
    generation: reports.reduce(
      (sum, item) => sum + item.machines[engineKey].generation,
      0,
    ),
    runningHours: reports.reduce(
      (sum, item) => sum + item.machines[engineKey].monthHours,
      0,
    ),
    hfo: reports.reduce((sum, item) => sum + item.machines[engineKey].hfo, 0),
    lfo: reports.reduce((sum, item) => sum + item.machines[engineKey].lfo, 0),
    lube: reports.reduce(
      (sum, item) => sum + item.machines[engineKey].lubeTotal,
      0,
    ),
  }));

  const byMachine =
    filters.engine === "all"
      ? byMachineAll
      : byMachineAll.filter((item) => item.key === filters.engine);

  const byMonth = reports.map((item) => {
    const selectedGeneration = selectedEngineKeys.reduce(
      (sum, key) => sum + item.machines[key].generation,
      0,
    );

    const selectedRunningHours = selectedEngineKeys.reduce(
      (sum, key) => sum + item.machines[key].monthHours,
      0,
    );

    return {
      monthKey: item.monthKey,
      totalGeneration: selectedGeneration,
      gasGeneration: item.energy.gasGenerationKwh,
      hfoGeneration: item.energy.hfoGenerationKwh,
      gasConsumption: item.energy.gasConsumptionNm3,
      hfoClosing: item.oils.hfo.closing,
      lfoClosing: item.oils.lfo.closing,
      lubeClosing: item.oils.lubeOil.total.closing,
      runningHours: selectedRunningHours,
      hfoReceived: item.oils.hfo.received,
      hfoConsumed: item.oils.hfo.totalConsumption,
      hfoTransferred: item.oils.hfo.transferredToCement,
      lfoReceived: item.oils.lfo.received,
      lfoConsumed: item.oils.lfo.totalConsumption,
      lubeReceived: item.oils.lubeOil.total.received,
      lubeConsumed: item.oils.lubeOil.total.totalConsumption,
    };
  });

  const lubeByType = ALL_LUBE_KEYS.map((key) => ({
    key,
    name: LUBE_LABELS[key],
    isActive: ACTIVE_LUBE_KEYS.includes(key),
    opening: reports.reduce(
      (sum, item) => sum + item.oils.lubeOil[key].opening,
      0,
    ),
    received: reports.reduce(
      (sum, item) => sum + item.oils.lubeOil[key].received,
      0,
    ),
    consumed: reports.reduce(
      (sum, item) => sum + item.oils.lubeOil[key].totalConsumption,
      0,
    ),
    closing: reports.reduce(
      (sum, item) => sum + item.oils.lubeOil[key].closing,
      0,
    ),
  }));

  return {
    totals: {
      totalGeneration: byMachine.reduce(
        (sum, item) => sum + item.generation,
        0,
      ),
      gasGeneration: reports.reduce(
        (sum, item) => sum + item.energy.gasGenerationKwh,
        0,
      ),
      hfoGeneration: reports.reduce(
        (sum, item) => sum + item.energy.hfoGenerationKwh,
        0,
      ),
      gasConsumption: reports.reduce(
        (sum, item) => sum + item.energy.gasConsumptionNm3,
        0,
      ),
      exportedEnergy: reports.reduce(
        (sum, item) => sum + item.energy.exported,
        0,
      ),
      runningHours: byMachine.reduce((sum, item) => sum + item.runningHours, 0),
      hfoReceived: reports.reduce(
        (sum, item) => sum + item.oils.hfo.received,
        0,
      ),
      hfoConsumed: reports.reduce(
        (sum, item) => sum + item.oils.hfo.totalConsumption,
        0,
      ),
      hfoClosing: reports.at(-1)?.oils.hfo.closing || 0,
      lfoReceived: reports.reduce(
        (sum, item) => sum + item.oils.lfo.received,
        0,
      ),
      lfoConsumed: reports.reduce(
        (sum, item) => sum + item.oils.lfo.totalConsumption,
        0,
      ),
      lfoClosing: reports.at(-1)?.oils.lfo.closing || 0,
      lubeReceived: reports.reduce(
        (sum, item) => sum + item.oils.lubeOil.total.received,
        0,
      ),
      lubeConsumed: reports.reduce(
        (sum, item) => sum + item.oils.lubeOil.total.totalConsumption,
        0,
      ),
      lubeClosing: reports.at(-1)?.oils.lubeOil.total.closing || 0,
    },
    byMachine,
    byMachineAll,
    byMonth,
    lubeByType,
  };
}
