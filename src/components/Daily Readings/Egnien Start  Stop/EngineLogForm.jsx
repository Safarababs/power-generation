import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const engines = ["E1", "E2", "E3", "E4", "E5"];

export default function EngineLogForm({ currentUser }) {
  const [engineId, setEngineId] = useState("E1");
  const [status, setStatus] = useState("stopped");
  const [eventTime, setEventTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastLog, setLastLog] = useState(null);

  const fetchStatus = async (id) => {
    try {
      const q = query(
        collection(db, "engineLogs"),
        where("engineId", "==", id),
        orderBy("eventDateTime", "desc"),
        limit(1),
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setStatus("stopped");
        setLastLog(null);
        return;
      }

      const lastDoc = snap.docs[0].data();
      setLastLog(lastDoc);
      setStatus(lastDoc.eventType === "start" ? "running" : "stopped");
    } catch (error) {
      console.error("Error fetching engine status:", error);
      alert("Failed to fetch engine status.");
    }
  };

  useEffect(() => {
    fetchStatus(engineId);
  }, [engineId]);

  const updateEngineStatus = async (
    selectedEngineId,
    eventType,
    selectedTime,
  ) => {
    await setDoc(doc(db, "engineStatus", selectedEngineId), {
      engineId: selectedEngineId,
      currentStatus: eventType === "start" ? "running" : "stopped",
      lastEventType: eventType,
      lastEventTime: new Date(selectedTime),
      updatedAt: new Date(),
      createdBy: {
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        department: currentUser?.department || "",
        empNumber: currentUser?.empNumber || "",
      },
    });
  };

  const updateMonthlyTotals = async (
    selectedEngineId,
    eventType,
    selectedTime,
  ) => {
    const [y, m] = selectedTime.split("T")[0].split("-");
    const monthKey = `${y}_${m}`;
    const monthDocRef = doc(db, "engine_start_stop", monthKey);
    const monthSnap = await getDoc(monthDocRef);

    let current = { starts: 0, stops: 0 };
    if (monthSnap.exists()) {
      current = monthSnap.data()?.[selectedEngineId] || {
        starts: 0,
        stops: 0,
      };
    }

    await setDoc(
      monthDocRef,
      {
        [selectedEngineId]: {
          starts: current.starts + (eventType === "start" ? 1 : 0),
          stops: current.stops + (eventType === "stop" ? 1 : 0),
          updatedAt: new Date(),
          createdBy: {
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            department: currentUser?.department || "",
            empNumber: currentUser?.empNumber || "",
          },
        },
      },
      { merge: true },
    );
  };

  const validateEntry = () => {
    if (!eventTime) {
      alert("Enter event time");
      return false;
    }

    const selectedTime = new Date(eventTime);
    const now = new Date();

    if (Number.isNaN(selectedTime.getTime())) {
      alert("Invalid event time");
      return false;
    }

    if (selectedTime > now) {
      alert("Event time cannot be in the future");
      return false;
    }

    const eventType = status === "running" ? "stop" : "start";

    if (eventType === "stop" && !reason.trim()) {
      alert("Enter reason for stop");
      return false;
    }

    if (eventType === "stop" && reason.trim().length < 3) {
      alert("Reason must be at least 3 characters");
      return false;
    }

    if (lastLog) {
      const lastTime = lastLog.eventDateTime?.toDate
        ? lastLog.eventDateTime.toDate()
        : new Date(lastLog.eventDateTime);

      if (selectedTime <= lastTime) {
        alert("Event time must be later than the last logged event");
        return false;
      }

      if (lastLog.eventType === eventType) {
        alert(
          `Invalid sequence. Last event was already ${eventType.toUpperCase()}.`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;

    const isValid = validateEntry();
    if (!isValid) return;

    setLoading(true);

    try {
      const eventType = status === "running" ? "stop" : "start";

      await addDoc(collection(db, "engineLogs"), {
        engineId,
        eventType,
        eventDateTime: new Date(eventTime),
        reason: eventType === "stop" ? reason.trim() : reason.trim(),
        loggedAt: serverTimestamp(),
        createdBy: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          department: currentUser?.department || "",
          empNumber: currentUser?.empNumber || "",
        },
      });

      await updateEngineStatus(engineId, eventType, eventTime);
      await updateMonthlyTotals(engineId, eventType, eventTime);

      alert(`${eventType.toUpperCase()} logged successfully`);
      setReason("");
      setEventTime("");
      await fetchStatus(engineId);
    } catch (error) {
      console.error("Error saving engine log:", error);
      alert("Error saving engine log: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container max-w-lg mx-auto p-6 rounded-lg shadow-md 
                 bg-[var(--surface-color)] text-[var(--text-primary)] space-y-6"
    >
      <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">
        Engine Log Entry
      </h2>

      <div className="flex flex-col space-y-2">
        <label className="font-medium">Select Engine</label>
        <select
          value={engineId}
          onChange={(e) => setEngineId(e.target.value)}
          className="form-input"
          disabled={loading}
        >
          {engines.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-medium">Current Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            status === "running"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium">Event Time</label>
        <input
          type="datetime-local"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium">
          {status === "running" ? "Reason for Stop" : "Reason for Start"}
        </label>
        <input
          placeholder="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          status === "running"
            ? { color: "white", backgroundColor: "red" }
            : { color: "white", backgroundColor: "green" }
        }
      >
        {status === "running"
          ? loading
            ? "Stopping..."
            : "Stop Engine"
          : loading
            ? "Starting..."
            : "Start Engine"}
      </button>
    </div>
  );
}
