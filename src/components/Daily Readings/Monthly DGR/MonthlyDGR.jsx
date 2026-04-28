import React, { useEffect, useMemo, useState } from "react";
import {
  applyPreviousMonthOpening,
  buildDerivedMonthlyReport,
  createInitialMonthlyReport,
  ENGINE_FUEL_MODES,
  ENGINE_KEYS,
  ENGINE_LABELS,
  formatNumber,
  getMonthlyReport,
  getPreviousMonthKey,
  LUBE_LABELS,
  LUBE_OIL_OPTIONS_BY_ENGINE,
  makeMonthKey,
  monthOptions,
  OIL_KEYS,
  OIL_LABELS,
  saveMonthlyReport,
  validateMonthlyReport,
} from "./monthlyFuelReportService";

const Spinner = () => (
  <span className="spinner inline-block" aria-hidden="true" />
);

const FieldError = ({ message }) =>
  message ? <p className="text-sm text-red mt-1">{message}</p> : null;

export default function MonthlyFuelReportForm() {
  const [form, setForm] = useState(
    buildDerivedMonthlyReport(createInitialMonthlyReport()),
  );
  const [errors, setErrors] = useState({
    month: "",
    oils: {},
    machines: {},
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [existingMonth, setExistingMonth] = useState(false);

  const monthKey = useMemo(
    () => makeMonthKey(form.year, form.month),
    [form.year, form.month],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadMonthInfo() {
      try {
        const current = await getMonthlyReport(monthKey);
        const previous = await getMonthlyReport(
          getPreviousMonthKey(form.year, form.month),
        );

        if (cancelled) return;

        setExistingMonth(Boolean(current));

        setForm((prev) => {
          if (current) return buildDerivedMonthlyReport(prev);
          return applyPreviousMonthOpening(prev, previous);
        });
      } catch {
        if (!cancelled) {
          setErrors((prev) => ({
            ...prev,
            general: "Unable to load previous month information.",
          }));
        }
      }
    }

    loadMonthInfo();

    return () => {
      cancelled = true;
    };
  }, [monthKey, form.year, form.month]);

  const updateForm = (updater) => {
    setSuccessMessage("");
    setForm((prev) =>
      buildDerivedMonthlyReport(
        typeof updater === "function" ? updater(prev) : updater,
      ),
    );
  };

  const handleMonthChange = (field, value) => {
    updateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMachineChange = (machineKey, field, value) => {
    updateForm((prev) => ({
      ...prev,
      machines: {
        ...prev.machines,
        [machineKey]: {
          ...prev.machines[machineKey],
          [field]: value,
        },
      },
    }));
  };

  const handleLubeUsageChange = (machineKey, lubeKey, field, value) => {
    updateForm((prev) => ({
      ...prev,
      machines: {
        ...prev.machines,
        [machineKey]: {
          ...prev.machines[machineKey],
          lubeUsage: {
            ...prev.machines[machineKey].lubeUsage,
            [lubeKey]: {
              ...prev.machines[machineKey].lubeUsage[lubeKey],
              [field]: value,
            },
          },
        },
      },
    }));
  };

  const handleBasicChange = (section, field, value) => {
    updateForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleOilChange = (oilKey, field, value) => {
    if (["dgSets", "cat", "volvo", "closing"].includes(field)) return;

    updateForm((prev) => ({
      ...prev,
      oils: {
        ...prev.oils,
        [oilKey]: {
          ...prev.oils[oilKey],
          [field]: value,
        },
      },
    }));
  };

  const resetForm = () => {
    setForm(buildDerivedMonthlyReport(createInitialMonthlyReport()));
    setErrors({ month: "", oils: {}, machines: {}, general: "" });
    setExistingMonth(false);
    setSuccessMessage("Monthly report saved successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const payload = buildDerivedMonthlyReport(form);
      const validation = validateMonthlyReport(payload);

      if (existingMonth)
        validation.month = "This monthly report already exists.";

      const oilHasErrors = Object.values(validation.oils || {}).some((group) =>
        Object.values(group || {}).some(Boolean),
      );
      const machineHasErrors = Object.values(validation.machines || {}).some(
        Boolean,
      );

      setErrors(validation);

      if (
        validation.month ||
        validation.general ||
        oilHasErrors ||
        machineHasErrors
      )
        return;

      await saveMonthlyReport(payload);
      resetForm();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Failed to save monthly report.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">Monthly Fuel, Gas and Oil Report</h2>
      </div>

      <div className="card-content">
        {errors.general ? (
          <div className="alert alert-danger">{errors.general}</div>
        ) : null}
        {successMessage ? (
          <div className="alert alert-success">{successMessage}</div>
        ) : null}
        {existingMonth ? (
          <div className="alert alert-warning">
            Report already exists for this month. Use manager edit screen to
            update it.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                className={`form-input ${errors.month ? "border-red-500 bg-red-50" : ""}`}
                value={form.year}
                onChange={(event) =>
                  handleMonthChange("year", event.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                className={`form-input ${errors.month ? "border-red-500 bg-red-50" : ""}`}
                value={form.month}
                onChange={(event) =>
                  handleMonthChange("month", event.target.value)
                }
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <FieldError message={errors.month} />

          <div className="alert alert-info">
            Multi-lube logic: DG1-DG3 can use TI4040 and Shell Argina S5 BN55 in
            the same month. DG4-DG5 can use TI4020 and Shell Argina S4 BN40 in
            the same month. All usage is auto-added to the correct lube oil
            balance.
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Machine Wise Section</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 gap-4">
                {ENGINE_KEYS.map((machineKey) => {
                  const allowedLubes =
                    LUBE_OIL_OPTIONS_BY_ENGINE[machineKey] || [];
                  return (
                    <div key={machineKey} className="card p-3">
                      <h4 className="card-title mb-3">
                        {ENGINE_LABELS[machineKey]}
                      </h4>
                      <FieldError message={errors.machines?.[machineKey]} />

                      <div className="grid grid-cols-4 gap-4">
                        <div className="form-group">
                          <label className="form-label">Fuel Mode</label>
                          <select
                            className="form-input"
                            value={
                              form.machines[machineKey].fuelMode || "hfoLfo"
                            }
                            onChange={(event) =>
                              handleMachineChange(
                                machineKey,
                                "fuelMode",
                                event.target.value,
                              )
                            }
                          >
                            {ENGINE_FUEL_MODES.map((mode) => (
                              <option key={mode.key} value={mode.key}>
                                {mode.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {[
                          ["monthHours", "Month Hrs"],
                          ["totalHours", "Total Hrs"],
                          ["generation", "Generation KWH"],

                          ["hfo", "HFO"],
                          ["lfo", "LFO"],
                          ["efficiency", "Efficiency %"],
                        ].map(([field, label]) => (
                          <div className="form-group" key={field}>
                            <label className="form-label">{label}</label>
                            <input
                              type="number"
                              min="0"
                              className="form-input"
                              value={form.machines[machineKey][field]}
                              onChange={(event) =>
                                handleMachineChange(
                                  machineKey,
                                  field,
                                  event.target.value,
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="card mt-4">
                        <div className="card-header">
                          <h5 className="card-title">Lube Oil Consumption</h5>
                        </div>
                        <div className="card-content">
                          <div className="grid grid-cols-2 gap-4">
                            {allowedLubes.map((lubeKey) => (
                              <div key={lubeKey} className="card p-3">
                                <h6 className="font-semibold mb-3">
                                  {LUBE_LABELS[lubeKey]}
                                </h6>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="form-group">
                                    <label className="form-label">Top Up</label>
                                    <input
                                      type="number"
                                      min="0"
                                      className="form-input"
                                      value={
                                        form.machines[machineKey].lubeUsage?.[
                                          lubeKey
                                        ]?.topup || ""
                                      }
                                      onChange={(event) =>
                                        handleLubeUsageChange(
                                          machineKey,
                                          lubeKey,
                                          "topup",
                                          event.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">
                                      Replace
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      className="form-input"
                                      value={
                                        form.machines[machineKey].lubeUsage?.[
                                          lubeKey
                                        ]?.replace || ""
                                      }
                                      onChange={(event) =>
                                        handleLubeUsageChange(
                                          machineKey,
                                          lubeKey,
                                          "replace",
                                          event.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Energy and Gas</h3>
            </div>
            <div className="card-content grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Energy Generated KWH</label>
                <input
                  type="number"
                  readOnly
                  className="form-input"
                  value={form.energy.generated}
                />
                <p className="text-sm text-secondary mt-1">
                  Auto-sum from all machine generation.
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Energy Exported KWH</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.exported}
                  onChange={(event) =>
                    handleBasicChange("energy", "exported", event.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">In House Consumption KWH</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.inHouse}
                  onChange={(event) =>
                    handleBasicChange("energy", "inHouse", event.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">RO Consumption KWH</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.roConsumption}
                  onChange={(event) =>
                    handleBasicChange(
                      "energy",
                      "roConsumption",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Total Generation on Gas KWH
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.gasGenerationKwh}
                  onChange={(event) =>
                    handleBasicChange(
                      "energy",
                      "gasGenerationKwh",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Gas Consumption NM3</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.gasConsumptionNm3}
                  onChange={(event) =>
                    handleBasicChange(
                      "energy",
                      "gasConsumptionNm3",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Total Generation on HFO KWH
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.energy.hfoGenerationKwh}
                  onChange={(event) =>
                    handleBasicChange(
                      "energy",
                      "hfoGenerationKwh",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gas SFOC NM3/KWH</label>
                <input
                  type="number"
                  readOnly
                  className="form-input"
                  value={form.energy.gasSfocNm3PerKwh}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Performance</h3>
              </div>
              <div className="card-content grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">SFOC g/kwh (HFO + LFO)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.performance.sfoc}
                    onChange={(event) =>
                      handleBasicChange(
                        "performance",
                        "sfoc",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SLOC gms/kwh</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.performance.sloc}
                    onChange={(event) =>
                      handleBasicChange(
                        "performance",
                        "sloc",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">RO Water</h3>
              </div>
              <div className="card-content grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Produced</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.roWater.produced}
                    onChange={(event) =>
                      handleBasicChange(
                        "roWater",
                        "produced",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Exported</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.roWater.exported}
                    onChange={(event) =>
                      handleBasicChange(
                        "roWater",
                        "exported",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {OIL_KEYS.map((oilKey) => (
            <div className="card" key={oilKey}>
              <div className="card-header">
                <h3 className="card-title">{OIL_LABELS[oilKey]} Balance</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ["opening", "Opening Balance"],
                    ["received", "Received"],
                    ["transferredToCement", "Transferred to Cement"],
                    ["dgSets", "DG Sets"],
                    ["bs", "Black Start"],
                    ["volvo", "VOLVO"],
                    ["cat", "CAT"],
                    ["boilers", "Boilers"],
                    ["closing", "Closing Balance"],
                  ].map(([field, label]) => {
                    const readOnly = [
                      "dgSets",
                      "cat",
                      "volvo",
                      "closing",
                    ].includes(field);
                    return (
                      <div className="form-group" key={field}>
                        <label className="form-label">{label}</label>
                        <input
                          type="number"
                          min="0"
                          readOnly={readOnly}
                          className={`form-input ${errors.oils?.[oilKey]?.[field] ? "border-red-500 bg-red-50" : ""}`}
                          value={form.oils[oilKey][field]}
                          onChange={(event) =>
                            handleOilChange(oilKey, field, event.target.value)
                          }
                        />
                        <FieldError message={errors.oils?.[oilKey]?.[field]} />
                      </div>
                    );
                  })}
                </div>
                <div className="alert alert-info mt-4">
                  {OIL_LABELS[oilKey]} closing:{" "}
                  {formatNumber(form.oils[oilKey].closing)}
                </div>
              </div>
            </div>
          ))}

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Remarks</h3>
            </div>
            <div className="card-content">
              <textarea
                className="form-input"
                rows={5}
                value={form.remarks}
                onChange={(event) =>
                  updateForm((prev) => ({
                    ...prev,
                    remarks: event.target.value,
                  }))
                }
                placeholder="Write monthly remarks here"
              />
            </div>
          </div>

          <div className="alert alert-info">
            Auto calculations: generation KWH, HFO/LFO DG consumption,
            multi-lube oil allocation, gas SFOC, and all closing balances.
          </div>

          <button
            type="submit"
            disabled={isSubmitting || existingMonth}
            className={`btn btn-primary ${isSubmitting || existingMonth ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Spinner />
                <span>Saving...</span>
              </span>
            ) : (
              "Save Monthly Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
