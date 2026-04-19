import React, { useEffect, useMemo, useState } from "react";
import {
  formatNumber,
  getLatestRecordBeforeDate,
  getRecordByDate,
  LITERS_PER_MM,
  MAX_DAILY_TANK_DIFF,
  MAX_FUEL_LITERS,
  saveTankSounding,
  TANK_COLLECTION,
  TANK_COUNT,
  toNumber,
  todayString,
  validateTankForm,
} from "./fuelTankService.js";

const TankFieldError = ({ message }) =>
  message ? <p className="text-sm text-red mt-1">{message}</p> : null;

const TankSpinner = () => (
  <span className="spinner inline-block" aria-hidden="true" />
);

export default function DailyTankSoundingForm() {
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
  const [previousRecord, setPreviousRecord] = useState(null);
  const [errors, setErrors] = useState({ date: "", tanks: {}, general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPrevious() {
      try {
        const record = await getLatestRecordBeforeDate(TANK_COLLECTION, date);
        if (!cancelled) setPreviousRecord(record);
      } catch {
        if (!cancelled) {
          setErrors((prev) => ({
            ...prev,
            general: "Unable to load previous tank record.",
          }));
        }
      }
    }

    if (date) loadPrevious();

    return () => {
      cancelled = true;
    };
  }, [date]);

  const tankPreview = useMemo(
    () =>
      Array.from({ length: TANK_COUNT }).map((_, index) => {
        const key = `tank${index + 1}`;
        const dip = toNumber(dips[key]);
        const liters = dip === null ? null : dip * LITERS_PER_MM;
        const previousDip = Number(previousRecord?.tanks?.[key]?.dip ?? 0);
        const difference = dip === null ? null : dip - previousDip;
        return { key, label: `Tank ${index + 1}`, dip, liters, difference };
      }),
    [dips, previousRecord],
  );

  const liveValidate = async (nextDate, nextDips) => {
    const nextErrors = validateTankForm({
      date: nextDate,
      dips: nextDips,
      previousRecord,
    });
    if (nextDate) {
      const existing = await getRecordByDate(TANK_COLLECTION, nextDate);
      if (existing) nextErrors.date = "An entry already exists for this date.";
    }
    setErrors(nextErrors);
  };

  const handleDateChange = async (event) => {
    const nextDate = event.target.value;
    setDate(nextDate);
    setSuccessMessage("");
    try {
      await liveValidate(nextDate, dips);
    } catch {
      setErrors((prev) => ({ ...prev, general: "Live validation failed." }));
    }
  };

  const handleTankChange = async (event) => {
    const { name, value } = event.target;
    const nextDips = { ...dips, [name]: value };
    setDips(nextDips);
    setSuccessMessage("");
    try {
      await liveValidate(date, nextDips);
    } catch {
      setErrors((prev) => ({ ...prev, general: "Live validation failed." }));
    }
  };

  const resetForm = () => {
    setDate(todayString());
    setDips(initialTanks);
    setErrors({ date: "", tanks: {}, general: "" });
    setSuccessMessage("Tank sounding saved successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const finalErrors = validateTankForm({ date, dips, previousRecord });
      const existing = await getRecordByDate(TANK_COLLECTION, date);
      if (existing) finalErrors.date = "Duplicate date is not allowed.";

      setErrors(finalErrors);
      const hasTankErrors = Object.values(finalErrors.tanks || {}).some(
        Boolean,
      );
      const hasFormErrors = Boolean(finalErrors.date || finalErrors.general);
      if (hasTankErrors || hasFormErrors) return;

      await saveTankSounding({ date, dips });
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
            <label className="form-label" htmlFor="tank-date">
              Date
            </label>
            <input
              id="tank-date"
              type="date"
              value={date}
              onChange={handleDateChange}
              max={todayString()}
              className={`form-input input-date ${errors.date ? "border-red-500 bg-red-50" : ""}`}
            />
            <TankFieldError message={errors.date} />
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
                    type="number"
                    min="0"
                    value={dips[tank.key]}
                    onChange={handleTankChange}
                    placeholder={`Enter ${tank.label.toLowerCase()} dip`}
                    className={`form-input ${errors.tanks?.[tank.key] ? "border-red-500 bg-red-50" : ""}`}
                  />
                  <TankFieldError message={errors.tanks?.[tank.key]} />
                </div>

                <div className="text-sm text-secondary">
                  <p>
                    Liters:{" "}
                    <strong className="text-primary">
                      {formatNumber(tank.liters)}
                    </strong>
                  </p>
                  <p>
                    Difference:{" "}
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
            1 mm = {LITERS_PER_MM} liters. Maximum daily difference per tank ={" "}
            {formatNumber(MAX_DAILY_TANK_DIFF)} mm. Maximum calculated liters ={" "}
            {formatNumber(MAX_FUEL_LITERS)}.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary mt-4 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <TankSpinner />
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
