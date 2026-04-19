import React, { useEffect, useMemo, useState } from "react";
import {
  FUEL_COLLECTION,
  formatNumber,
  getLatestRecordBeforeDate,
  getRecordByDate,
  MAX_FUEL_LITERS,
  saveFuelEntry,
  todayString,
  toNumber,
  validateFuelForm,
} from "./fuelTankService.js";

const Spinner = () => (
  <span className="spinner inline-block" aria-hidden="true" />
);

const FieldError = ({ message }) =>
  message ? <p className="text-sm text-red mt-1">{message}</p> : null;

export default function DailyFuelEntryForm() {
  const [form, setForm] = useState({ date: todayString(), liters: "" });
  const [previousRecord, setPreviousRecord] = useState(null);
  const [errors, setErrors] = useState({ date: "", liters: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const liters = useMemo(() => toNumber(form.liters), [form.liters]);

  useEffect(() => {
    let cancelled = false;

    async function loadPrevious() {
      try {
        const record = await getLatestRecordBeforeDate(
          FUEL_COLLECTION,
          form.date,
        );
        if (!cancelled) setPreviousRecord(record);
      } catch {
        if (!cancelled) {
          setErrors((prev) => ({
            ...prev,
            general: "Unable to load previous fuel record.",
          }));
        }
      }
    }

    if (form.date) loadPrevious();

    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const runLiveValidation = async (nextForm) => {
    const nextErrors = validateFuelForm({
      date: nextForm.date,
      liters: toNumber(nextForm.liters),
      previousRecord,
    });

    if (nextForm.date) {
      const existing = await getRecordByDate(FUEL_COLLECTION, nextForm.date);
      if (existing) nextErrors.date = "An entry already exists for this date.";
    }

    setErrors(nextErrors);
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setSuccessMessage("");
    setForm(nextForm);

    try {
      await runLiveValidation(nextForm);
    } catch {
      setErrors((prev) => ({ ...prev, general: "Live validation failed." }));
    }
  };

  const resetForm = () => {
    setForm({ date: todayString(), liters: "" });
    setErrors({ date: "", liters: "", general: "" });
    setSuccessMessage("Fuel entry saved successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const finalErrors = validateFuelForm({
        date: form.date,
        liters,
        previousRecord,
      });
      const existing = await getRecordByDate(FUEL_COLLECTION, form.date);
      if (existing) finalErrors.date = "Duplicate date is not allowed.";

      setErrors(finalErrors);
      if (Object.values(finalErrors).some(Boolean)) return;

      await saveFuelEntry({ date: form.date, liters });
      resetForm();
      setPreviousRecord(null);
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
                type="date"
                name="date"
                max={todayString()}
                value={form.date}
                onChange={handleChange}
                className={`form-input input-date ${errors.date ? "border-red-500 bg-red-50" : ""}`}
              />
              <FieldError message={errors.date} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fuel-liters">
                Fuel Quantity (Liters)
              </label>
              <input
                id="fuel-liters"
                type="number"
                name="liters"
                min="0"
                max={MAX_FUEL_LITERS}
                value={form.liters}
                onChange={handleChange}
                placeholder="Enter fuel quantity"
                className={`form-input ${errors.liters ? "border-red-500 bg-red-50" : ""}`}
              />
              <FieldError message={errors.liters} />
            </div>
          </div>

          {previousRecord ? (
            <div className="alert alert-info">
              Previous saved value:{" "}
              <strong>{formatNumber(Number(previousRecord.liters))}</strong>{" "}
              liters on {previousRecord.date}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
