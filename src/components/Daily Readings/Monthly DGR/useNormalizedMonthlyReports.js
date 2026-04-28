import { useEffect, useMemo, useState } from "react";
import {
  fetchNormalizedMonthlyReports,
  summarizeExecutiveData,
} from "./monthlyReportNormalizeService";

export default function useNormalizedMonthlyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNormalizedMonthlyReports();
      setReports(data);
    } catch (err) {
      setError(err?.message || "Failed to load monthly reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const summary = useMemo(() => summarizeExecutiveData(reports), [reports]);

  return {
    reports,
    summary,
    loading,
    error,
    reload: loadReports,
  };
}
