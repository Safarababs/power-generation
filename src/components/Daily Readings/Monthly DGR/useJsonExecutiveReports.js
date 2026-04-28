import { useEffect, useMemo, useState } from "react";
import {
  filterExecutiveReports,
  getAvailableYears,
  loadMonthlyReportsFromJson,
  summarizeExecutiveData,
} from "./monthlyJsonReportService";

export default function useJsonExecutiveReports(
  jsonPath = "/data/monthly-fuel-reports-normalized.json",
) {
  const [allReports, setAllReports] = useState([]);
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
    engine: "all",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await loadMonthlyReportsFromJson(jsonPath);
      setAllReports(data);
    } catch (err) {
      setError(err?.message || "Failed to load JSON reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [jsonPath]);

  const reports = useMemo(
    () => filterExecutiveReports(allReports, filters),
    [allReports, filters],
  );

  const years = useMemo(() => getAvailableYears(allReports), [allReports]);

  const summary = useMemo(
    () => summarizeExecutiveData(reports, filters),
    [reports, filters],
  );

  return {
    allReports,
    reports,
    summary,
    filters,
    setFilters,
    years,
    loading,
    error,
    reload: loadReports,
  };
}
