import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

export const MONTHLY_COLLECTION = "DGRmonthlyReports";

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

export const LUBE_KEYS = [
  "ti4040",
  "ti4020",
  "shellArginaS5Bn55",
  "shellArginaS4Bn40",
];

export const LUBE_LABELS = {
  ti4040: "TI4040",
  ti4020: "TI4020",
  shellArginaS5Bn55: "Shell Argina S5 BN55",
  shellArginaS4Bn40: "Shell Argina S4 BN40",
};

export const FUEL_COLORS = {
  hfo: "#1d4ed8",
  lfo: "#059669",
  gas: "#475569",
  ti4040: "#f97316",
  ti4020: "#7c3aed",
  shellArginaS5Bn55: "#dc2626",
  shellArginaS4Bn40: "#0f766e",
  generation: "#2563eb",
  runningHours: "#9333ea",
  export: "#0891b2",
  consumption: "#ea580c",
  balance: "#16a34a",
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

const emptyLubeUsageForAllTypes = () => ({
  ti4040: { topup: 0, replace: 0, total: 0 },
  ti4020: { topup: 0, replace: 0, total: 0 },
  shellArginaS5Bn55: { topup: 0, replace: 0, total: 0 },
  shellArginaS4Bn40: { topup: 0, replace: 0, total: 0 },
});

const emptyOilMovement = () => ({
  opening: 0,
  received: 0,
  transferredToCement: 0,
  dgSets: 0,
  bs: 0,
  volvo: 0,
  cat: 0,
  boilers: 0,
  closing: 0,
  totalConsumption: 0,
});

const emptyMachine = () => ({
  fuelMode: "hfoLfo",
  monthHours: 0,
  totalHours: 0,
  generation: 0,
  hfo: 0,
  lfo: 0,
  efficiency: 0,
  lubeUsage: emptyLubeUsageForAllTypes(),
  lubeTotal: 0,
});

const normalizeOilMovement = (oil = {}) => {
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
    totalConsumption: 0,
  };

  normalized.totalConsumption =
    normalized.transferredToCement +
    normalized.dgSets +
    normalized.bs +
    normalized.volvo +
    normalized.cat +
    normalized.boilers;

  return normalized;
};

const addLubeUsage = (target, lubeKey, topup, replace) => {
  if (!target[lubeKey]) return;
  target[lubeKey].topup += numberValue(topup);
  target[lubeKey].replace += numberValue(replace);
  target[lubeKey].total = target[lubeKey].topup + target[lubeKey].replace;
};

const normalizeEngineLubeUsage = (engineKey, engine = {}) => {
  const usage = emptyLubeUsageForAllTypes();

  // New latest format: machines.dg1.lubeUsage.ti4040.topup/replace
  if (engine.lubeUsage) {
    LUBE_KEYS.forEach((lubeKey) => {
      addLubeUsage(
        usage,
        lubeKey,
        engine.lubeUsage?.[lubeKey]?.topup,
        engine.lubeUsage?.[lubeKey]?.replace,
      );
    });
  }

  // Previous format: one lubeOilType + lubeTopup/lubeReplace
  if (!engine.lubeUsage && engine.lubeOilType) {
    addLubeUsage(
      usage,
      engine.lubeOilType,
      engine.lubeTopup,
      engine.lubeReplace,
    );
  }

  // Oldest format: only lubeTopup/lubeReplace, no lube type.
  // We keep compatibility by putting old DG1-DG3 into TI4040 and old DG4-DG5 into TI4020.
  if (
    !engine.lubeUsage &&
    !engine.lubeOilType &&
    (engine.lubeTopup || engine.lubeReplace)
  ) {
    const fallbackLubeKey = ["dg4", "dg5"].includes(engineKey)
      ? "ti4020"
      : "ti4040";
    addLubeUsage(usage, fallbackLubeKey, engine.lubeTopup, engine.lubeReplace);
  }

  return usage;
};

const normalizeMachine = (engineKey, engine = {}) => {
  const lubeUsage = normalizeEngineLubeUsage(engineKey, engine);
  const lubeTotal = LUBE_KEYS.reduce(
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

const buildLubeOilMovements = (report) => {
  const oils = report.oils || {};

  const lubeMovements = {
    ti4040: normalizeOilMovement(oils.ti4040),
    ti4020: normalizeOilMovement(oils.ti4020),
    shellArginaS5Bn55: normalizeOilMovement(oils.shellArginaS5Bn55),
    shellArginaS4Bn40: normalizeOilMovement(oils.shellArginaS4Bn40),
  };

  // Old single lubeOil fallback. It is stored into legacy bucket information,
  // and opening/closing is copied to TI4040 only if no new lube type exists.
  const hasNewLubeData = LUBE_KEYS.some(
    (key) =>
      numberValue(oils?.[key]?.opening) ||
      numberValue(oils?.[key]?.received) ||
      numberValue(oils?.[key]?.closing) ||
      numberValue(oils?.[key]?.dgSets),
  );

  const legacyLubeOil = oils.lubeOil
    ? normalizeOilMovement(oils.lubeOil)
    : emptyOilMovement();

  if (!hasNewLubeData && oils.lubeOil) {
    lubeMovements.ti4040 = {
      ...lubeMovements.ti4040,
      opening: legacyLubeOil.opening,
      received: legacyLubeOil.received,
      dgSets: legacyLubeOil.dgSets,
      bs: legacyLubeOil.bs,
      volvo: legacyLubeOil.volvo,
      cat: legacyLubeOil.cat,
      boilers: legacyLubeOil.boilers,
      closing: legacyLubeOil.closing,
      totalConsumption: legacyLubeOil.totalConsumption,
      legacySource: true,
    };
  }

  return {
    ...lubeMovements,
    legacyLubeOil,
    total: {
      opening: LUBE_KEYS.reduce(
        (sum, key) => sum + numberValue(lubeMovements[key].opening),
        0,
      ),
      received: LUBE_KEYS.reduce(
        (sum, key) => sum + numberValue(lubeMovements[key].received),
        0,
      ),
      closing: LUBE_KEYS.reduce(
        (sum, key) => sum + numberValue(lubeMovements[key].closing),
        0,
      ),
      totalConsumption: LUBE_KEYS.reduce(
        (sum, key) => sum + numberValue(lubeMovements[key].totalConsumption),
        0,
      ),
    },
  };
};

export const normalizeMonthlyReport = (rawReport = {}) => {
  const machines = ENGINE_KEYS.reduce((acc, key) => {
    acc[key] = normalizeMachine(key, rawReport.machines?.[key]);
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

  const hfo = normalizeOilMovement(rawReport.oils?.hfo);
  const lfo = normalizeOilMovement(rawReport.oils?.lfo);
  const lubeOil = buildLubeOilMovements(rawReport);

  return {
    id:
      rawReport.id ||
      rawReport.monthKey ||
      `${rawReport.year}-${rawReport.month}`,
    monthKey: rawReport.monthKey || `${rawReport.year}-${rawReport.month}`,
    year: String(rawReport.year || ""),
    month: String(rawReport.month || ""),
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
      hfo,
      lfo,
      lubeOil,
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
    raw: rawReport,
  };
};

export async function fetchNormalizedMonthlyReports() {
  const q = query(
    collection(db, MONTHLY_COLLECTION),
    orderBy("monthKey", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) =>
    normalizeMonthlyReport({ id: item.id, ...item.data() }),
  );
}

export function downloadJsonFile(
  data,
  filename = "monthly-fuel-reports-normalized.json",
) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportNormalizedMonthlyReportsJson() {
  const reports = await fetchNormalizedMonthlyReports();
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    sourceCollection: MONTHLY_COLLECTION,
    totalReports: reports.length,
    schema: "executive-normalized-v1",
    reports,
  };

  downloadJsonFile(exportPayload);
  return exportPayload;
}

export function summarizeExecutiveData(reports = []) {
  const byMachine = ENGINE_KEYS.map((engineKey) => ({
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

  const byMonth = reports.map((item) => ({
    monthKey: item.monthKey,
    totalGeneration: item.energy.generated,
    gasGeneration: item.energy.gasGenerationKwh,
    hfoGeneration: item.energy.hfoGenerationKwh,
    gasConsumption: item.energy.gasConsumptionNm3,
    hfoClosing: item.oils.hfo.closing,
    lfoClosing: item.oils.lfo.closing,
    lubeClosing: item.oils.lubeOil.total.closing,
    runningHours: item.totals.totalRunningHours,
  }));

  const lubeByType = LUBE_KEYS.map((key) => ({
    key,
    name: LUBE_LABELS[key],
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
      totalGeneration: reports.reduce(
        (sum, item) => sum + item.energy.generated,
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
      runningHours: reports.reduce(
        (sum, item) => sum + item.totals.totalRunningHours,
        0,
      ),
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
    byMonth,
    lubeByType,
  };
}
