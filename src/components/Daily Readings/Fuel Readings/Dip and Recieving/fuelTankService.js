/* =========================
   src/services/fuelTankService.js
   ========================= */
import {
  doc,
  getDoc,
  getDocs,
  collection,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

export const MAX_FUEL_LITERS = 2_000_000;
export const TANK_COUNT = 10;
export const LITERS_PER_MM = 179;
export const MAX_DAILY_TANK_DIFF = 10_000;
export const FUEL_COLLECTION = "dailyFuelEntries";
export const TANK_COLLECTION = "dailyTankSoundings";

export const todayString = () => new Date().toISOString().split("T")[0];

export const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatNumber = (value) =>
  value === null || value === undefined || Number.isNaN(value)
    ? "-"
    : new Intl.NumberFormat().format(value);

export const buildDateDocId = (date) => date;

export async function getLatestRecordBeforeDate(collectionName, date) {
  const q = query(
    collection(db, collectionName),
    where("date", "<", date),
    orderBy("date", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function getRecordByDate(collectionName, date) {
  const ref = doc(db, collectionName, buildDateDocId(date));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export function validateFuelForm({ date, liters, previousRecord }) {
  const errors = { date: "", liters: "", general: "" };

  if (!date) {
    errors.date = "Date is required.";
  } else if (date > todayString()) {
    errors.date = "Future date is not allowed.";
  }

  if (liters === null) {
    errors.liters = "Fuel quantity is required.";
  } else if (liters < 0) {
    errors.liters = "Fuel quantity cannot be less than zero.";
  } else if (liters > MAX_FUEL_LITERS) {
    errors.liters = `Fuel quantity cannot be greater than ${MAX_FUEL_LITERS}.`;
  }

  return errors;
}

export function validateTankForm({ date, dips, previousRecord }) {
  const errors = { date: "", tanks: {}, general: "" };

  if (!date) {
    errors.date = "Date is required.";
  } else if (date > todayString()) {
    errors.date = "Future date is not allowed.";
  }

  for (let i = 1; i <= TANK_COUNT; i += 1) {
    const key = `tank${i}`;
    const dip = toNumber(dips[key]);

    if (dip === null) {
      errors.tanks[key] = "Dip is required.";
      continue;
    }

    if (dip < 0) {
      errors.tanks[key] = "Dip cannot be less than zero.";
      continue;
    }

    const liters = dip * LITERS_PER_MM;
    if (liters > MAX_FUEL_LITERS) {
      errors.tanks[key] =
        `Calculated liters cannot exceed ${formatNumber(MAX_FUEL_LITERS)}.`;
      continue;
    }

    if (previousRecord) {
      const previousDip = Number(previousRecord.tanks?.[key]?.dip ?? 0);
      const difference = dip - previousDip;

      if (difference < 0) {
        errors.tanks[key] =
          "Difference from previous record cannot be negative.";
        continue;
      }

      if (difference > MAX_DAILY_TANK_DIFF) {
        errors.tanks[key] =
          `Difference cannot be greater than ${formatNumber(MAX_DAILY_TANK_DIFF)} mm.`;
      }
    }
  }

  return errors;
}

export async function saveFuelEntry({ date, liters }) {
  const docId = buildDateDocId(date);
  const entryRef = doc(db, FUEL_COLLECTION, docId);

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(entryRef);
    if (existing.exists()) {
      throw new Error("Duplicate date is not allowed.");
    }

    const previousRecord = await getLatestRecordBeforeDate(
      FUEL_COLLECTION,
      date,
    );
    const validation = validateFuelForm({ date, liters, previousRecord });
    const hasError = Object.values(validation).some(Boolean);

    if (hasError) {
      const firstError =
        validation.date || validation.liters || validation.general;
      throw new Error(firstError || "Fuel validation failed.");
    }

    const previousLiters = Number(previousRecord?.liters ?? 0);

    transaction.set(entryRef, {
      date,
      dateKey: date,
      liters,
      previousLiters,
      difference: previousRecord ? liters - previousLiters : 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function saveTankSounding({ date, dips }) {
  const docId = buildDateDocId(date);
  const entryRef = doc(db, TANK_COLLECTION, docId);

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(entryRef);
    if (existing.exists()) {
      throw new Error("Duplicate date is not allowed.");
    }

    const previousRecord = await getLatestRecordBeforeDate(
      TANK_COLLECTION,
      date,
    );
    const validation = validateTankForm({ date, dips, previousRecord });
    const hasTankErrors = Object.values(validation.tanks || {}).some(Boolean);
    const hasFormErrors = Boolean(validation.date || validation.general);

    if (hasTankErrors || hasFormErrors) {
      const firstTankError = Object.values(validation.tanks || {}).find(
        Boolean,
      );
      throw new Error(
        validation.date ||
          validation.general ||
          firstTankError ||
          "Tank validation failed.",
      );
    }

    const tanks = {};

    for (let i = 1; i <= TANK_COUNT; i += 1) {
      const key = `tank${i}`;
      const dip = Number(dips[key]);
      const previousDip = Number(previousRecord?.tanks?.[key]?.dip ?? 0);
      const liters = dip * LITERS_PER_MM;
      const difference = dip - previousDip;

      tanks[key] = {
        dip,
        liters,
        difference,
        previousDip,
      };
    }

    transaction.set(entryRef, {
      date,
      dateKey: date,
      litersPerMm: LITERS_PER_MM,
      tanks,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}
