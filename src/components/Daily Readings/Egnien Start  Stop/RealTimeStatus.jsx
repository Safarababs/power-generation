import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

export default function RealTimeStatus() {
  const [engines, setEngines] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "engineStatus"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEngines(data);
      console.log("Real-time engine status updated:", data);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      {engines.map((engine) => (
        <div
          key={engine.id}
          style={{
            width: "150px",
            height: "120px",
            borderRadius: "10px",
            backgroundColor:
              engine.currentStatus === "running" ? "#4caf50" : "#f44336",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h3>{engine.engineId}</h3>
          <p style={{ fontWeight: "bold" }}>
            {engine.currentStatus.toUpperCase()}
          </p>
          <small>{engine.lastEventTime?.toDate().toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
}
