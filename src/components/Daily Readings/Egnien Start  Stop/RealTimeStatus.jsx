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
      console.log(window.innerWidth);
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
          maxWidth: window.innerWidth < 450 ? "40px" : "200px",
          minWidth: window.innerWidth < 450 ? "40px" : "140px",
          height: window.innerWidth < 450 ? "40px" : "160px",
          borderRadius: "10px",
          backgroundColor:
            engine.currentStatus === "running" ? "#4caf50" : "#ffffff",

          color: engine.currentStatus === "running" ? "#fff" : "black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease-in-out",
          marginBottom: window.innerWidth < 450 ? "5px" : "15px", // space below each card
          padding: window.innerWidth < 450 ? "5px" : "10px",
        };

        return (
          <div
            key={engine.id}
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Engine ID */}
            <h3
              style={{
                fontSize: window.innerWidth < 450 ? "16px" : "26px",
                fontWeight: "bold",
                marginBottom: window.innerWidth < 450 ? "2px" : "6px",
              }}
            >
              {engine.engineId}
            </h3>

            {/* Status */}
            {/* if on mobile then display without details */}
            {window.innerWidth >= 450 ? (
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                {engine.currentStatus.toUpperCase()}
              </p>
            ) : null}

            {/* Since running or last stop */}
            {window.innerWidth >= 450 ? (
              engine.currentStatus === "running" ? (
                <small
                  style={{
                    fontSize: "12px",
                    opacity: 0.9,
                    marginBottom: "4px",
                  }}
                >
                  Since: {engine.lastEventTime?.toDate().toLocaleDateString()}
                </small>
              ) : (
                <small
                  style={{
                    fontSize: "12px",
                    opacity: 0.9,
                    marginBottom: "4px",
                  }}
                >
                  Since: {engine.lastEventTime?.toDate().toLocaleDateString()}
                </small>
              )
            ) : null}

            {/* Start/Stop time on next line */}
            {window.innerWidth >= 450 ? (
              <small style={{ fontSize: "12px", opacity: 0.8 }}>
                {engine.lastEventTime?.toDate().toLocaleTimeString()}
              </small>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
