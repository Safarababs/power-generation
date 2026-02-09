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
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const engines = ["E1", "E2", "E3", "E4", "E5"];

export default function EngineLogForm() {
  const [engineId, setEngineId] = useState("E1");
  const [status, setStatus] = useState("stopped");
  const [eventTime, setEventTime] = useState("");
  const [reason, setReason] = useState("");

  // Fetch last engine status
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

  // Update engineStatus collection
  const updateEngineStatus = async (engineId, eventType, eventTime) => {
    await setDoc(doc(db, "engineStatus", engineId), {
      engineId,
      currentStatus: eventType === "start" ? "running" : "stopped",
      lastEventType: eventType,
      lastEventTime: new Date(eventTime),
      updatedAt: new Date(),
    });
  };

  // Submit Log
  const handleSubmit = async () => {
    if (!eventTime) return alert("Enter event time");

    const eventType = status === "running" ? "stop" : "start";

    await addDoc(collection(db, "engineLogs"), {
      engineId,
      eventType,
      eventDateTime: new Date(eventTime),
      reason: eventType === "stop" ? reason : "",
      loggedAt: serverTimestamp(),
    });

    await updateEngineStatus(engineId, eventType, eventTime);

    alert(`${eventType.toUpperCase()} logged`);
    setReason("");
    fetchStatus(engineId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Engine Log Entry</h2>

      <select value={engineId} onChange={(e) => setEngineId(e.target.value)}>
        {engines.map((e) => (
          <option key={e}>{e}</option>
        ))}
      </select>

      <p>
        Current Status:{" "}
        <b style={{ color: status === "running" ? "green" : "red" }}>
          {status.toUpperCase()}
        </b>
      </p>

      <input
        type="datetime-local"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      {status === "running" && (
        <input
          placeholder="Reason for Stop"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      )}

      <br />
      <button onClick={handleSubmit}>
        Submit {status === "running" ? "STOP" : "START"}
      </button>
    </div>
  );
}
