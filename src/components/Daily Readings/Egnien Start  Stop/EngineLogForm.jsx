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

  const fetchStatus = async (id) => {
    const q = query(
      collection(db, "engineLogs"),
      where("engineId", "==", id),
      orderBy("eventDateTime", "desc"),
      limit(1),
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      setStatus("stopped");
      return;
    }
    const lastEvent = snap.docs[0].data().eventType;
    setStatus(lastEvent === "start" ? "running" : "stopped");
  };

  useEffect(() => {
    fetchStatus(engineId);
  }, [engineId]);

  const updateEngineStatus = async (engineId, eventType, eventTime) => {
    await setDoc(doc(db, "engineStatus", engineId), {
      engineId,
      currentStatus: eventType === "start" ? "running" : "stopped",
      lastEventType: eventType,
      lastEventTime: new Date(eventTime),
      updatedAt: new Date(),
      createdBy: {
        name: currentUser?.name, // "Safar Abbas"
        email: currentUser?.email, // "safarabbas73.sa@gmail.com"
        department: currentUser?.department, // "developer"
        empNumber: currentUser?.empNumber, // "058"
      },
    });
  };

  const handleSubmit = async () => {
    if (!eventTime) return alert("Enter event time");
    const eventType = status === "running" ? "stop" : "start";

    await addDoc(collection(db, "engineLogs"), {
      engineId,
      eventType,
      eventDateTime: new Date(eventTime),
      reason: eventType === "stop" ? reason : "",
      loggedAt: serverTimestamp(),
      createdBy: {
        name: currentUser?.name, // "Safar Abbas"
        email: currentUser?.email, // "safarabbas73.sa@gmail.com"
        department: currentUser?.department, // "developer"
        empNumber: currentUser?.empNumber, // "058"
      },
    });

    const updateMonthlyTotals = async (engineId, eventType, eventTime) => {
      const [y, m] = eventTime.split("T")[0].split("-");
      const monthKey = `${y}_${m}`; // e.g. "2026_03"
      const monthDocRef = doc(db, "engine_start_stop", monthKey);
      const monthSnap = await getDoc(monthDocRef);

      let current = {};
      if (monthSnap.exists()) {
        current = monthSnap.data()[engineId] || { starts: 0, stops: 0 };
      }

      await setDoc(
        monthDocRef,
        {
          [engineId]: {
            starts: current.starts + (eventType === "start" ? 1 : 0),
            stops: current.stops + (eventType === "stop" ? 1 : 0),
            updatedAt: new Date(),
            createdBy: {
              name: currentUser?.name,
              email: currentUser?.email,
              department: currentUser?.department,
              empNumber: currentUser?.empNumber,
            },
          },
        },
        { merge: true },
      );
    };

    await updateEngineStatus(engineId, eventType, eventTime);
    await updateMonthlyTotals(engineId, eventType, eventTime);

    alert(`${eventType.toUpperCase()} logged`);
    setReason("");
    fetchStatus(engineId);
  };

  return (
    <div
      className="container max-w-lg mx-auto p-6 rounded-lg shadow-md 
                  bg-[var(--surface-color)] text-[var(--text-primary)] space-y-6"
    >
      <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">
        Engine Log Entry
      </h2>

      {/* Engine Selector */}
      <div className="flex flex-col space-y-2">
        <label className="font-medium">Select Engine</label>
        <select
          value={engineId}
          onChange={(e) => setEngineId(e.target.value)}
          className="form-input"
        >
          {engines.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Current Status */}
      <div className="flex items-center space-x-2">
        <span className="font-medium">Current Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            status === "running"
              ? "bg-green-500 text-green"
              : "bg-red-500 text-red"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* Event Time */}
      <div className="flex flex-col space-y-2">
        <label className="font-medium">Event Time</label>
        <input
          type="datetime-local"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Reason for Stop */}
      {status === "stopped" && (
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Reason for Start</label>
          <input
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-input"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="btn-primary"
        style={
          status === "running"
            ? { color: "white", backgroundColor: "green" }
            : { color: "white", backgroundColor: "red" }
        }
      >
        {status === "running" ? "STOP NOW" : "START NOW"}
      </button>
    </div>
  );
}
