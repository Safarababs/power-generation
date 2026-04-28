import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import MillStatusBoard from "./MillStatusBoard";

const MILL_NAMES = ["CM1", "CM2", "CM3", "RM1", "RM2", "KILN1", "KILN2"];

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatReadableDateTime = (value) => {
  if (!value) return "--";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function Spinner({ text = "Saving record..." }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="spinner"
        style={{ width: "1.2rem", height: "1.2rem", borderWidth: "3px" }}
      />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default function MillStatusForm({ currentUser }) {
  const [millStatusMap, setMillStatusMap] = useState({});
  const [formData, setFormData] = useState({
    millName: MILL_NAMES[0],
    startTime: "",
    stopTime: "",
    currentlyRunning: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "millCurrentStatus"),
      (snapshot) => {
        const nextMap = {};
        snapshot.forEach((docSnap) => {
          nextMap[docSnap.id] = docSnap.data();
        });
        setMillStatusMap(nextMap);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const selectedMill = formData.millName;
    const lastStatus = millStatusMap[selectedMill];

    if (!lastStatus) {
      setFormData((prev) => ({
        ...prev,
        startTime: prev.startTime || formatDateTimeLocal(new Date()),
        stopTime: "",
        currentlyRunning: true,
      }));
      return;
    }

    const isRunning = Boolean(lastStatus.currentlyRunning);

    setFormData((prev) => ({
      ...prev,
      currentlyRunning: isRunning,
      startTime: isRunning
        ? prev.startTime ||
          formatDateTimeLocal(lastStatus.startTime || new Date())
        : prev.startTime || formatDateTimeLocal(lastStatus.startTime),
      stopTime: isRunning
        ? ""
        : prev.stopTime || formatDateTimeLocal(new Date()),
    }));
  }, [formData.millName, millStatusMap]);

  const selectedMillLastStatus = useMemo(() => {
    return millStatusMap[formData.millName] || null;
  }, [formData.millName, millStatusMap]);

  const disableStartInput =
    !formData.currentlyRunning && Boolean(selectedMillLastStatus?.startTime);
  const disableStopInput = formData.currentlyRunning;

  const handleMillChange = (e) => {
    const millName = e.target.value;
    setMessage({ type: "", text: "" });
    setFormData({
      millName,
      startTime: "",
      stopTime: "",
      currentlyRunning: millStatusMap[millName]?.currentlyRunning ?? true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.millName) {
      setMessage({ type: "danger", text: "Please select a mill." });
      return;
    }

    if (!formData.startTime) {
      setMessage({ type: "danger", text: "Start time is required." });
      return;
    }

    if (!formData.currentlyRunning && !formData.stopTime) {
      setMessage({
        type: "danger",
        text: "Stop time is required when mill is stopped.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        millName: formData.millName,
        startTime: new Date(formData.startTime).toISOString(),
        stopTime: formData.currentlyRunning
          ? null
          : new Date(formData.stopTime).toISOString(),
        startStatus: Boolean(formData.startTime),
        stopStatus: !formData.currentlyRunning,
        currentlyRunning: formData.currentlyRunning,
        createdBy: currentUser?.name || "Unknown User",
        department: currentUser?.department || "Unknown Department",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "millStatusHistory"), payload);

      await setDoc(doc(db, "millCurrentStatus", formData.millName), {
        millName: formData.millName,
        startTime: payload.startTime,
        stopTime: payload.stopTime,
        startStatus: payload.startStatus,
        stopStatus: payload.stopStatus,
        currentlyRunning: payload.currentlyRunning,
        createdBy: payload.createdBy,
        department: payload.department,
        updatedAt: serverTimestamp(),
      });

      setMessage({
        type: "success",
        text: `${formData.millName} status saved successfully.`,
      });

      setFormData((prev) => ({
        ...prev,
        startTime: formData.currentlyRunning
          ? formatDateTimeLocal(new Date())
          : prev.startTime,
        stopTime: "",
      }));
    } catch (error) {
      console.error("Error saving mill status:", error);
      setMessage({
        type: "danger",
        text: "Failed to save record.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MillStatusBoard />
      <div className="card fade-in">
        <div className="card-header flex justify-between items-center">
          <div>
            <h2 className="card-title">Real-Time Feeder Monitoring</h2>
            <p className="text-sm text-secondary mt-1">
              Update mill running or stopped status and save.
            </p>
          </div>
        </div>

        <div className="card-content">
          {message.text ? (
            <div
              className={`alert alert-${message.type === "danger" ? "danger" : message.type}`}
            >
              {message.text}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Mill Name</label>
                <select
                  className="form-select"
                  value={formData.millName}
                  onChange={handleMillChange}
                  disabled={saving}
                >
                  {MILL_NAMES.map((mill) => (
                    <option key={mill} value={mill}>
                      {mill}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current State</label>
                <div className="flex items-center justify-between p-3 border rounded mill-status-toggle">
                  <span className="text-sm font-medium">
                    {formData.currentlyRunning ? "Running" : "Stopped"}
                  </span>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.currentlyRunning}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentlyRunning: e.target.checked,
                          stopTime: e.target.checked
                            ? ""
                            : prev.stopTime || formatDateTimeLocal(new Date()),
                        }))
                      }
                      disabled={saving}
                    />
                    <span className="text-sm">Currently Running</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  className="form-select"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  disabled={saving || disableStartInput}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stop Time</label>
                <input
                  type="datetime-local"
                  className="form-select"
                  value={formData.stopTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stopTime: e.target.value,
                    }))
                  }
                  disabled={saving || disableStopInput}
                />
              </div>
            </div>

            {selectedMillLastStatus ? (
              <div className="alert alert-info">
                <strong>Last submitted status:</strong>{" "}
                {selectedMillLastStatus.currentlyRunning
                  ? "Running"
                  : "Stopped"}
                <br />
                <span>
                  Start:{" "}
                  {formatReadableDateTime(selectedMillLastStatus.startTime)} |
                  Stop:{" "}
                  {formatReadableDateTime(selectedMillLastStatus.stopTime)}
                </span>
              </div>
            ) : (
              <div className="alert alert-warning">
                No previous status found for this mill. First entry will be
                treated as start.
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${saving ? "opacity-75 cursor-not-allowed" : ""}`}
              disabled={saving}
            >
              {saving ? <Spinner /> : "Save Record"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
