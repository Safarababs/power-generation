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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        justifyContent: "center",
      }}
    >
      {engines.map((engine) => {
        const cardStyle = {
          flex: "1 1 160px",
          maxWidth: "200px",
          minWidth: "140px",
          height: "160px",
          borderRadius: "10px",
          backgroundColor:
            engine.currentStatus === "running" ? "#4caf50" : "#f44336",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease-in-out",
          marginBottom: "15px", // space below each card
          padding: "10px",
        };

        return (
          <div
            key={engine.id}
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Engine ID */}
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {engine.engineId}
            </h3>

            {/* Status */}
            <p
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              {engine.currentStatus.toUpperCase()}
            </p>

            {/* Since running or last stop */}
            {engine.currentStatus === "running" ? (
              <small
                style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}
              >
                Since: {engine.lastEventTime?.toDate().toLocaleDateString()}
              </small>
            ) : (
              <small
                style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}
              >
                Since: {engine.lastEventTime?.toDate().toLocaleDateString()}
              </small>
            )}

            {/* Start/Stop time on next line */}
            <small style={{ fontSize: "12px", opacity: 0.8 }}>
              {engine.lastEventTime?.toDate().toLocaleTimeString()}
            </small>
          </div>
        );
      })}
    </div>
  );
}
