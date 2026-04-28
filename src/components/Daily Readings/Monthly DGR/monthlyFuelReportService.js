import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

export const MONTHLY_COLLECTION = "DGRmonthlyReports";

export const ENGINE_KEYS = ["dg1", "dg2", "dg3", "dg4", "dg5", "cat", "volvo"];
export const DG_KEYS = ["dg1", "dg2", "dg3", "dg4", "dg5"];
export const PURE_HFO_LFO_ENGINES = ["dg1", "dg2", "dg3"];
export const GAS_CAPABLE_ENGINES = ["dg4", "dg5"];

export const ENGINE_LABELS = {
  dg1: "DG 1",
  dg2: "DG 2",
  dg3: "DG 3",
  dg4: "DG 4",
  dg5: "DG 5",
  cat: "CAT",
  volvo: "VOLVO",
};

export const ENGINE_FUEL_MODES = [
  { key: "hfoLfo", label: "HFO/LFO Mode" },
  { key: "gas", label: "Gas Mode" },
  { key: "mixed", label: "Mixed Mode" },
];

export const LUBE_KEYS = [
  "ti4040",
  "ti4020",
  "shellArginaS5Bn55",
  "shellArginaS4Bn40",
];

export const LUBE_OIL_TYPES = [
  { key: "ti4040", label: "TI4040" },
  { key: "ti4020", label: "TI4020" },
  { key: "shellArginaS5Bn55", label: "Shell Argina S5 BN55" },
  { key: "shellArginaS4Bn40", label: "Shell Argina S4 BN40" },
];

export const LUBE_LABELS = {
  ti4040: "TI4040",
  ti4020: "TI4020",
  shellArginaS5Bn55: "Shell Argina S5 BN55",
  shellArginaS4Bn40: "Shell Argina S4 BN40",
};

export const LUBE_OIL_OPTIONS_BY_ENGINE = {
  dg1: ["shellArginaS5Bn55"],
  dg2: ["shellArginaS5Bn55"],
  dg3: ["shellArginaS5Bn55"],
  dg4: ["ti4020", "shellArginaS4Bn40", "shellArginaS5Bn55"],
  dg5: ["ti4020", "shellArginaS4Bn40"],
};

export const OIL_KEYS = [
  "hfo",
  "lfo",
  "ti4040",
  "ti4020",
  "shellArginaS5Bn55",
  "shellArginaS4Bn40",
];

export const OIL_LABELS = {
  hfo: "HFO",
  lfo: "LFO",
  ti4040: "Lube Oil - TI4040",
  ti4020: "Lube Oil - TI4020",
  shellArginaS5Bn55: "Lube Oil - Shell Argina S5 BN55",
  shellArginaS4Bn40: "Lube Oil - Shell Argina S4 BN40",
};

export const FUEL_COLORS = {
  hfo: "#2563eb",
  lfo: "#16a34a",
  ti4040: "#f97316",
  ti4020: "#a855f7",
  shellArginaS5Bn55: "#ef4444",
  shellArginaS4Bn40: "#0f766e",
  gas: "#64748b",
};

export const MACHINE_COLORS = {
  dg1: "#2563eb",
  dg2: "#16a34a",
  dg3: "#f97316",
  dg4: "#a855f7",
  dg5: "#ef4444",
  cat: "#0f766e",
  volvo: "#64748b",
};

export const monthOptions = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const numberValue = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatNumber = (value) =>
  new Intl.NumberFormat().format(numberValue(value));

export const makeMonthKey = (year, month) => `${year}-${month}`;

export const getPreviousMonthKey = (year, month) => {
  const date = new Date(Number(year), Number(month) - 1, 1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const emptyLubeUsage = (engineKey) => {
  const allowedTypes = LUBE_OIL_OPTIONS_BY_ENGINE[engineKey] || [];
  return allowedTypes.reduce((acc, lubeKey) => {
    acc[lubeKey] = {
      topup: "",
      replace: "",
    };
    return acc;
  }, {});
};

export const emptyEngine = (engineKey = "dg1") => ({
  fuelMode: GAS_CAPABLE_ENGINES.includes(engineKey) ? "hfoLfo" : "hfoLfo",
  monthHours: "",
  totalHours: "",
  generation: "",
  hfo: "",
  lfo: "",
  efficiency: "",
  lubeUsage: emptyLubeUsage(engineKey),
});

export const emptyOilBalance = () => ({
  opening: "",
  received: "",
  transferredToCement: "",
  dgSets: "",
  bs: "",
  volvo: "",
  cat: "",
  boilers: "",
  closing: "",
});

export const createInitialMonthlyReport = () => ({
  year: new Date().getFullYear().toString(),
  month: String(new Date().getMonth() + 1).padStart(2, "0"),
  machines: {
    dg1: emptyEngine("dg1"),
    dg2: emptyEngine("dg2"),
    dg3: emptyEngine("dg3"),
    dg4: emptyEngine("dg4"),
    dg5: emptyEngine("dg5"),
    cat: emptyEngine("cat"),
    volvo: emptyEngine("volvo"),
  },
  energy: {
    generated: "",
    exported: "",
    inHouse: "",
    roConsumption: "",
    gasGenerationKwh: "",
    gasConsumptionNm3: "",
    hfoGenerationKwh: "",
    gasSfocNm3PerKwh: "",
  },
  performance: {
    sfoc: "",
    sloc: "",
  },
  roWater: {
    produced: "",
    exported: "",
  },
  oils: {
    hfo: emptyOilBalance(),
    lfo: emptyOilBalance(),
    ti4040: emptyOilBalance(),
    ti4020: emptyOilBalance(),
    shellArginaS5Bn55: emptyOilBalance(),
    shellArginaS4Bn40: emptyOilBalance(),
  },
  remarks: "",
});

export const normalizeReportForCurrentSchema = (report) => {
  const base = createInitialMonthlyReport();
  const next = {
    ...base,
    ...report,
    machines: {
      ...base.machines,
      ...(report?.machines || {}),
    },
    energy: {
      ...base.energy,
      ...(report?.energy || {}),
    },
    performance: {
      ...base.performance,
      ...(report?.performance || {}),
    },
    roWater: {
      ...base.roWater,
      ...(report?.roWater || {}),
    },
    oils: {
      ...base.oils,
      ...(report?.oils || {}),
    },
  };

  ENGINE_KEYS.forEach((engineKey) => {
    const oldEngine = report?.machines?.[engineKey] || {};
    next.machines[engineKey] = {
      ...base.machines[engineKey],
      ...oldEngine,
      lubeUsage: {
        ...emptyLubeUsage(engineKey),
        ...(oldEngine.lubeUsage || {}),
      },
    };

    // Backward compatibility for previous single lube fields.
    if (
      !oldEngine.lubeUsage &&
      (oldEngine.lubeTopup || oldEngine.lubeReplace)
    ) {
      const fallbackKey = PURE_HFO_LFO_ENGINES.includes(engineKey)
        ? "ti4040"
        : GAS_CAPABLE_ENGINES.includes(engineKey)
          ? "ti4020"
          : "ti4040";

      if (next.machines[engineKey].lubeUsage[fallbackKey]) {
        next.machines[engineKey].lubeUsage[fallbackKey] = {
          topup: String(oldEngine.lubeTopup || ""),
          replace: String(oldEngine.lubeReplace || ""),
        };
      }
    }
  });

  return buildDerivedMonthlyReport(next);
};

export const computeOilClosing = (oil) => {
  return (
    numberValue(oil.opening) +
    numberValue(oil.received) -
    numberValue(oil.transferredToCement) -
    numberValue(oil.dgSets) -
    numberValue(oil.bs) -
    numberValue(oil.volvo) -
    numberValue(oil.cat) -
    numberValue(oil.boilers)
  );
};

export const getTotalLubeClosing = (oils) => {
  const newTotal = LUBE_KEYS.reduce(
    (sum, key) => sum + numberValue(oils?.[key]?.closing),
    0,
  );

  if (newTotal === 0 && oils?.lubeOil) {
    return numberValue(oils.lubeOil.closing);
  }

  return newTotal;
};

export const getEngineLubeTotal = (engine, lubeKey) => {
  const usage = engine?.lubeUsage?.[lubeKey] || {};
  return numberValue(usage.topup) + numberValue(usage.replace);
};

export const buildLubeAllocation = (machines) => {
  const allocation = {
    ti4040: { dgSets: 0, cat: 0, volvo: 0 },
    ti4020: { dgSets: 0, cat: 0, volvo: 0 },
    shellArginaS5Bn55: { dgSets: 0, cat: 0, volvo: 0 },
    shellArginaS4Bn40: { dgSets: 0, cat: 0, volvo: 0 },
  };

  ENGINE_KEYS.forEach((engineKey) => {
    const engine = machines[engineKey] || {};
    const allowedTypes = LUBE_OIL_OPTIONS_BY_ENGINE[engineKey] || [];

    allowedTypes.forEach((lubeKey) => {
      const consumed = getEngineLubeTotal(engine, lubeKey);

      if (DG_KEYS.includes(engineKey)) {
        allocation[lubeKey].dgSets += consumed;
      } else if (engineKey === "cat") {
        allocation[lubeKey].cat += consumed;
      } else if (engineKey === "volvo") {
        allocation[lubeKey].volvo += consumed;
      }
    });
  });

  return allocation;
};

export const buildDerivedMonthlyReport = (state) => {
  const machineGeneration = ENGINE_KEYS.reduce(
    (sum, key) => sum + numberValue(state.machines[key]?.generation),
    0,
  );

  const dgHfo = DG_KEYS.reduce(
    (sum, key) => sum + numberValue(state.machines[key]?.hfo),
    0,
  );

  const dgLfo = DG_KEYS.reduce(
    (sum, key) => sum + numberValue(state.machines[key]?.lfo),
    0,
  );

  const gasGeneration = numberValue(state.energy.gasGenerationKwh);
  const gasConsumption = numberValue(state.energy.gasConsumptionNm3);
  const gasSfoc = gasGeneration > 0 ? gasConsumption / gasGeneration : 0;
  const lubeAllocation = buildLubeAllocation(state.machines);

  const next = {
    ...state,
    energy: {
      ...state.energy,
      generated: String(machineGeneration),
      gasSfocNm3PerKwh: gasSfoc ? gasSfoc.toFixed(4) : "0",
    },
    oils: {
      ...state.oils,
      hfo: {
        ...state.oils.hfo,
        dgSets: String(dgHfo),
        cat: String(numberValue(state.machines.cat?.hfo)),
        volvo: String(numberValue(state.machines.volvo?.hfo)),
      },
      lfo: {
        ...state.oils.lfo,
        dgSets: String(dgLfo),
        cat: String(numberValue(state.machines.cat?.lfo)),
        volvo: String(numberValue(state.machines.volvo?.lfo)),
      },
    },
  };

  LUBE_KEYS.forEach((oilKey) => {
    next.oils[oilKey] = {
      ...next.oils[oilKey],
      dgSets: String(lubeAllocation[oilKey].dgSets),
      cat: String(lubeAllocation[oilKey].cat),
      volvo: String(lubeAllocation[oilKey].volvo),
    };
  });

  OIL_KEYS.forEach((oilKey) => {
    next.oils[oilKey] = {
      ...next.oils[oilKey],
      closing: String(computeOilClosing(next.oils[oilKey])),
    };
  });

  return next;
};

export const applyPreviousMonthOpening = (state, previousReport) => {
  if (!previousReport) return state;

  const normalizedPrevious = normalizeReportForCurrentSchema(previousReport);
  const next = { ...state, oils: { ...state.oils } };

  ["hfo", "lfo"].forEach((oilKey) => {
    next.oils[oilKey] = {
      ...next.oils[oilKey],
      opening: String(normalizedPrevious.oils?.[oilKey]?.closing ?? ""),
    };
  });

  LUBE_KEYS.forEach((oilKey) => {
    next.oils[oilKey] = {
      ...next.oils[oilKey],
      opening: String(normalizedPrevious.oils?.[oilKey]?.closing ?? ""),
    };
  });

  const hasNewLube = LUBE_KEYS.some(
    (key) => numberValue(previousReport.oils?.[key]?.closing) > 0,
  );
  if (!hasNewLube && previousReport.oils?.lubeOil) {
    next.oils.ti4040.opening = String(
      previousReport.oils.lubeOil.closing ?? "",
    );
  }

  return buildDerivedMonthlyReport(next);
};

export const validateMonthlyReport = (state) => {
  const errors = { month: "", oils: {}, machines: {}, general: "" };

  if (!state.year || !state.month) {
    errors.month = "Month and year are required.";
  }

  ENGINE_KEYS.forEach((engineKey) => {
    const engine = state.machines[engineKey] || {};
    const allowedTypes = LUBE_OIL_OPTIONS_BY_ENGINE[engineKey] || [];

    allowedTypes.forEach((lubeKey) => {
      const usage = engine.lubeUsage?.[lubeKey] || {};
      if (numberValue(usage.topup) < 0 || numberValue(usage.replace) < 0) {
        errors.machines[engineKey] =
          "Lube oil values cannot be less than zero.";
      }
    });
  });

  OIL_KEYS.forEach((oilKey) => {
    const oil = state.oils[oilKey];
    const oilErrors = {};

    [
      "opening",
      "received",
      "transferredToCement",
      "dgSets",
      "bs",
      "volvo",
      "cat",
      "boilers",
    ].forEach((field) => {
      if (numberValue(oil[field]) < 0) {
        oilErrors[field] = "Value cannot be less than zero.";
      }
    });

    if (computeOilClosing(oil) < 0) {
      oilErrors.closing = "Closing balance cannot be less than zero.";
    }

    errors.oils[oilKey] = oilErrors;
  });

  return errors;
};

export async function getMonthlyReport(monthKey) {
  const ref = doc(db, MONTHLY_COLLECTION, monthKey);
  const snapshot = await getDoc(ref);
  return snapshot.exists()
    ? normalizeReportForCurrentSchema({ id: snapshot.id, ...snapshot.data() })
    : null;
}

export function subscribeMonthlyReports(
  callback,
  errorCallback,
  sortDirection = "desc",
) {
  const q = query(
    collection(db, MONTHLY_COLLECTION),
    orderBy("monthKey", sortDirection),
  );
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs.map((item) =>
          normalizeReportForCurrentSchema({ id: item.id, ...item.data() }),
        ),
      ),
    errorCallback,
  );
}

export async function saveMonthlyReport(payload) {
  const report = buildDerivedMonthlyReport(payload);
  const monthKey = makeMonthKey(report.year, report.month);
  const validation = validateMonthlyReport(report);
  const oilHasErrors = Object.values(validation.oils || {}).some((group) =>
    Object.values(group || {}).some(Boolean),
  );
  const machineHasErrors = Object.values(validation.machines || {}).some(
    Boolean,
  );

  if (
    validation.month ||
    validation.general ||
    oilHasErrors ||
    machineHasErrors
  ) {
    throw new Error(
      validation.month ||
        validation.general ||
        "Monthly report validation failed.",
    );
  }

  await runTransaction(db, async (transaction) => {
    const ref = doc(db, MONTHLY_COLLECTION, monthKey);
    const existing = await transaction.get(ref);

    if (existing.exists()) {
      throw new Error("Duplicate month is not allowed.");
    }

    transaction.set(ref, {
      ...report,
      monthKey,
      dataVersion: "v3-multi-lube-usage",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateMonthlyReport(monthKey, payload) {
  const report = buildDerivedMonthlyReport(payload);
  const ref = doc(db, MONTHLY_COLLECTION, monthKey);
  await updateDoc(ref, {
    ...report,
    dataVersion: "v3-multi-lube-usage",
    updatedAt: serverTimestamp(),
  });
}
