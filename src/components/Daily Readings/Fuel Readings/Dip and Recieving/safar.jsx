// Multi-file implementation bundle
// Copy each section into its own file.
// Files included:
// 1) src/services/fuelTankService.js
// 2) src/components/DailyFuelEntryForm.jsx
// 3) src/components/DailyTankSoundingForm.jsx
// 4) src/pages/FuelAndTankFormsPage.jsx
// 5) firestore.rules






/* =========================
   src/pages/FuelAndTankFormsPage.jsx
   ========================= */
import React from "react";
import DailyFuelEntryForm from "../components/DailyFuelEntryForm";
import DailyTankSoundingForm from "../components/DailyTankSoundingForm";

export default function FuelAndTankFormsPage() {
  return (
    <div className="page-content">
      <div className="container">
        <div className="grid grid-cols-1 gap-6">
          <DailyFuelEntryForm />
          <DailyTankSoundingForm />
        </div>
      </div>
    </div>
  );
}

// 
import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const MAX_FUEL_LITERS = 2_000_000;
const TANK_COUNT = 10;
const LITERS_PER_MM = 179;
const MAX_DAILY_TANK_DIFF = 10_000;

const todayString = () => new Date().toISOString().split("T")[0];

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value) =>
  value === null || value === undefined || Number.isNaN(value)
    ? "-"
    : new Intl.NumberFormat().format(value);

const Spinner = () => (
  <span className="spinner inline-block" aria-hidden="true" />
);

const FieldError = ({ message }) =>
  message ? <p className="text-sm text-red mt-1">{message}</p> : null;

async function checkDuplicateByDate(collectionName, date) {
  const duplicateQuery = query(
    collection(db, collectionName),
    where("date", "==", date),
    limit(1),
  );
  const snapshot = await getDocs(duplicateQuery);
  return !snapshot.empty;
}

async function getLatestRecordBeforeDate(collectionName, date) {
  const previousQuery = query(
    collection(db, collectionName),
    where("date", "<", date),
    orderBy("date", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(previousQuery);
  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

function validateFuelForm({ date, liters, lastRecord }) {
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

  if (
    lastRecord &&
    liters !== null &&
    liters < Number(lastRecord.liters ?? 0)
  ) {
    errors.liters = `Fuel quantity cannot be less than previous saved value (${formatNumber(
      Number(lastRecord.liters ?? 0),
    )} liters).`;
  }

  return errors;
}

function validateTankForm({ date, dips, previousRecord }) {
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
      errors.tanks[key] = `Calculated liters cannot exceed ${formatNumber(
        MAX_FUEL_LITERS,
      )}.`;
      continue;
    }

    if (previousRecord) {
      const previousDip = Number(previousRecord.tanks?.[key]?.dip ?? 0);
      const diff = dip - previousDip;

      if (diff < 0) {
        errors.tanks[key] = "Difference from yesterday cannot be negative.";
        continue;
      }

      if (diff > MAX_DAILY_TANK_DIFF) {
        errors.tanks[key] = `Difference cannot be greater than ${formatNumber(
          MAX_DAILY_TANK_DIFF,
        )} mm.`;
      }
    }
  }

  return errors;
}

export function DailyFuelEntryForm() {
  const [form, setForm] = useState({ date: todayString(), liters: "" });
  const [errors, setErrors] = useState({ date: "", liters: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRecord, setLastRecord] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPrevious = async () => {
      if (!form.date) return;
      try {
        const record = await getLatestRecordBeforeDate(
          "dailyFuelEntries",
          form.date,
        );
        if (!ignore) {
          setLastRecord(record);
        }
      } catch (error) {
        if (!ignore) {
          setErrors((prev) => ({
            ...prev,
            general: "Unable to validate against previous fuel entry.",
          }));
        }
      }
    };

    loadPrevious();

    return () => {
      ignore = true;
    };
  }, [form.date]);

  const litersNumber = useMemo(() => toNumber(form.liters), [form.liters]);

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setSuccessMessage("");
    setForm((prev) => ({ ...prev, [name]: value }));

    const nextForm = { ...form, [name]: value };
    const validationErrors = validateFuelForm({
      date: nextForm.date,
      liters: toNumber(nextForm.liters),
      lastRecord,
    });

    if (name === "date" && value) {
      try {
        const isDuplicate = await checkDuplicateByDate(
          "dailyFuelEntries",
          value,
        );
        if (isDuplicate) {
          validationErrors.date = "An entry already exists for this date.";
        }
      } catch (error) {
        validationErrors.general = "Unable to verify duplicate date.";
      }
    }

    setErrors(validationErrors);
  };

  const resetForm = () => {
    setForm({ date: todayString(), liters: "" });
    setErrors({ date: "", liters: "", general: "" });
    setSuccessMessage("Fuel entry saved successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const duplicate = await checkDuplicateByDate(
        "dailyFuelEntries",
        form.date,
      );
      const previous = await getLatestRecordBeforeDate(
        "dailyFuelEntries",
        form.date,
      );

      const validationErrors = validateFuelForm({
        date: form.date,
        liters: litersNumber,
        lastRecord: previous,
      });

      if (duplicate) {
        validationErrors.date = "Duplicate date is not allowed.";
      }

      setErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some(Boolean);
      if (hasErrors) return;

      await addDoc(collection(db, "dailyFuelEntries"), {
        date: form.date,
        liters: litersNumber,
        previousLiters: Number(previous?.liters ?? 0),
        difference: previous ? litersNumber - Number(previous.liters ?? 0) : 0,
        createdAt: serverTimestamp(),
      });

      resetForm();
      setLastRecord(null);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Failed to save fuel entry.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">Daily Fuel Entry</h2>
      </div>
      <div className="card-content">
        {errors.general ? (
          <div className="alert alert-danger">{errors.general}</div>
        ) : null}
        {successMessage ? (
          <div className="alert alert-success">{successMessage}</div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="fuel-date">
                Date
              </label>
              <input
                id="fuel-date"
                className={`form-input input-date ${errors.date ? "border-red-500 bg-red-50" : ""}`}
                type="date"
                name="date"
                max={todayString()}
                value={form.date}
                onChange={handleChange}
              />
              <FieldError message={errors.date} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fuel-liters">
                Fuel Quantity (Liters)
              </label>
              <input
                id="fuel-liters"
                className={`form-input ${errors.liters ? "border-red-500 bg-red-50" : ""}`}
                type="number"
                name="liters"
                min="0"
                max={MAX_FUEL_LITERS}
                value={form.liters}
                onChange={handleChange}
                placeholder="Enter fuel quantity"
              />
              <FieldError message={errors.liters} />
            </div>
          </div>

          {lastRecord ? (
            <div className="alert alert-info">
              Previous saved value:{" "}
              <strong>{formatNumber(Number(lastRecord.liters))}</strong> liters
              on {lastRecord.date}
            </div>
          ) : null}

          <button
            className={`btn btn-primary ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Spinner />
                <span>Saving...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export function DailyTankSoundingForm() {
  const initialTanks = useMemo(
    () =>
      Array.from({ length: TANK_COUNT }).reduce((acc, _, index) => {
        acc[`tank${index + 1}`] = "";
        return acc;
      }, {}),
    [],
  );

  const [date, setDate] = useState(todayString());
  const [dips, setDips] = useState(initialTanks);
  const [errors, setErrors] = useState({ date: "", tanks: {}, general: "" });
  const [previousRecord, setPreviousRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPrevious = async () => {
      if (!date) return;
      try {
        const record = await getLatestRecordBeforeDate(
          "dailyTankSoundings",
          date,
        );
        if (!ignore) {
          setPreviousRecord(record);
        }
      } catch (error) {
        if (!ignore) {
          setErrors((prev) => ({
            ...prev,
            general: "Unable to load previous sounding record.",
          }));
        }
      }
    };

    loadPrevious();

    return () => {
      ignore = true;
    };
  }, [date]);

  const handleTankChange = (event) => {
    const { name, value } = event.target;
    setSuccessMessage("");

    const nextDips = { ...dips, [name]: value };
    setDips(nextDips);

    const nextErrors = validateTankForm({
      date,
      dips: nextDips,
      previousRecord,
    });
    setErrors(nextErrors);
  };

  const handleDateChange = async (event) => {
    const nextDate = event.target.value;
    setSuccessMessage("");
    setDate(nextDate);

    const nextErrors = validateTankForm({
      date: nextDate,
      dips,
      previousRecord,
    });

    try {
      const duplicate = await checkDuplicateByDate(
        "dailyTankSoundings",
        nextDate,
      );
      if (duplicate) {
        nextErrors.date = "An entry already exists for this date.";
      }
    } catch (error) {
      nextErrors.general = "Unable to verify duplicate date.";
    }

    setErrors(nextErrors);
  };

  const tankPreview = useMemo(
    () =>
      Array.from({ length: TANK_COUNT }).map((_, index) => {
        const key = `tank${index + 1}`;
        const dip = toNumber(dips[key]);
        const liters = dip === null ? null : dip * LITERS_PER_MM;
        const previousDip = Number(previousRecord?.tanks?.[key]?.dip ?? 0);
        const difference = dip === null ? null : dip - previousDip;

        return {
          key,
          label: `Tank ${index + 1}`,
          dip,
          liters,
          difference,
        };
      }),
    [dips, previousRecord],
  );

  const resetForm = () => {
    setDate(todayString());
    setDips(initialTanks);
    setErrors({ date: "", tanks: {}, general: "" });
    setSuccessMessage("Tank sounding saved successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const duplicate = await checkDuplicateByDate("dailyTankSoundings", date);
      const previous = await getLatestRecordBeforeDate(
        "dailyTankSoundings",
        date,
      );
      const validationErrors = validateTankForm({
        date,
        dips,
        previousRecord: previous,
      });

      if (duplicate) {
        validationErrors.date = "Duplicate date is not allowed.";
      }

      setErrors(validationErrors);

      const hasTankErrors = Object.values(validationErrors.tanks || {}).some(
        Boolean,
      );
      const hasFormErrors = Boolean(
        validationErrors.date || validationErrors.general,
      );

      if (hasTankErrors || hasFormErrors) return;

      const tanksPayload = tankPreview.reduce((acc, tank) => {
        acc[tank.key] = {
          dip: tank.dip,
          liters: tank.liters,
          difference: tank.difference ?? 0,
          previousDip: Number(previous?.tanks?.[tank.key]?.dip ?? 0),
        };
        return acc;
      }, {});

      await addDoc(collection(db, "dailyTankSoundings"), {
        date,
        litersPerMm: LITERS_PER_MM,
        tanks: tanksPayload,
        createdAt: serverTimestamp(),
      });

      resetForm();
      setPreviousRecord(null);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Failed to save tank sounding.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">Daily Tank Sounding</h2>
      </div>
      <div className="card-content">
        {errors.general ? (
          <div className="alert alert-danger">{errors.general}</div>
        ) : null}
        {successMessage ? (
          <div className="alert alert-success">{successMessage}</div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="sounding-date">
              Date
            </label>
            <input
              id="sounding-date"
              className={`form-input input-date ${errors.date ? "border-red-500 bg-red-50" : ""}`}
              type="date"
              value={date}
              onChange={handleDateChange}
              max={todayString()}
            />
            <FieldError message={errors.date} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {tankPreview.map((tank) => (
              <div key={tank.key} className="card p-3">
                <div className="form-group">
                  <label className="form-label" htmlFor={tank.key}>
                    {tank.label} Dip (mm)
                  </label>
                  <input
                    id={tank.key}
                    name={tank.key}
                    className={`form-input ${errors.tanks?.[tank.key] ? "border-red-500 bg-red-50" : ""}`}
                    type="number"
                    min="0"
                    value={dips[tank.key]}
                    onChange={handleTankChange}
                    placeholder={`Enter ${tank.label.toLowerCase()} dip`}
                  />
                  <FieldError message={errors.tanks?.[tank.key]} />
                </div>

                <div className="text-sm text-secondary">
                  <p>
                    Liters:{" "}
                    <strong className="text-primary">
                      {formatNumber(tank.liters)}
                    </strong>
                  </p>
                  <p>
                    Daily Difference:{" "}
                    <strong className="text-primary">
                      {formatNumber(tank.difference)}
                    </strong>{" "}
                    mm
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info mt-4">
            Conversion rule: 1 mm = {LITERS_PER_MM} liters. Example: 10120 mm ={" "}
            {formatNumber(10120 * LITERS_PER_MM)} liters.
          </div>

          <button
            className={`btn btn-primary mt-4 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Spinner />
                <span>Saving...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FuelAndTankFormsPage() {
  return (
    <div className="page-content">
      <div className="container">
        <div className="grid grid-cols-1 gap-6">
          <DailyFuelEntryForm />
          <DailyTankSoundingForm />
        </div>
      </div>
    </div>
  );
}


/* =========================
   firestore.rules
   =========================
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isValidDateString(value) {
      return value is string && value.matches('^\\d{4}-\\d{2}-\\d{2}$');
    }

    match /dailyFuelEntries/{dateId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn()
        && dateId == request.resource.data.date
        && isValidDateString(request.resource.data.date)
        && request.resource.data.dateKey == request.resource.data.date
        && request.resource.data.liters is number
        && request.resource.data.liters >= 0
        && request.resource.data.liters <= 2000000;
      allow update, delete: if false;
    }

    match /dailyTankSoundings/{dateId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn()
        && dateId == request.resource.data.date
        && isValidDateString(request.resource.data.date)
        && request.resource.data.dateKey == request.resource.data.date
        && request.resource.data.litersPerMm == 179;
      allow update, delete: if false;
    }
  }
}
*/

/* =========================
   Better next steps
   =========================
1. Add edit mode for today's record only.
2. Add a history table below each form.
3. Add a dashboard card for total liters across all 10 tanks.
4. Add anomaly badges for sudden tank movement near the 10,000 mm limit.
5. Add export to CSV/PDF.
6. Add role-based permissions in Firebase rules.
7. Add audit fields: createdBy, updatedBy, deviceTime.
8. Add a summary doc per day if you want quick reporting.
*/
