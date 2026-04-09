import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const MILL_NAMES = ["CM1", "CM2", "CM3", "RM1", "RM2", "KILN1", "KILN2"];

const formatReadableDate = (value) => {
  if (!value) return "--";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString();
};

const formatReadableTime = (value) => {
  if (!value) return "--";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MillStatusBoard() {
  const [mills, setMills] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 450);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 450);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const millsQuery = query(
      collection(db, "millCurrentStatus"),
      orderBy("millName"),
    );

    const unsubscribe = onSnapshot(millsQuery, (snapshot) => {
      const records = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMills(records);
    });

    return () => unsubscribe();
  }, []);

  const millMap = useMemo(() => {
    const map = new Map();
    mills.forEach((item) => map.set(item.millName, item));
    return map;
  }, [mills]);

  const orderedMills = useMemo(() => {
    return MILL_NAMES.map((millName) => {
      const existing = millMap.get(millName);
      return (
        existing || {
          id: millName,
          millName,
          currentlyRunning: false,
          startTime: null,
          stopTime: null,
          createdBy: "--",
          department: "--",
        }
      );
    });
  }, [millMap]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: isMobile ? "8px" : "15px",
        justifyContent: "center",
      }}
    >
      {orderedMills.map((mill) => {
        const isRunning = Boolean(mill.currentlyRunning);
        const sinceValue = isRunning
          ? mill.startTime
          : mill.stopTime || mill.startTime;

        const cardStyle = {
          flex: isMobile ? "1 1 72px" : "1 1 170px",
          maxWidth: isMobile ? "90px" : "210px",
          minWidth: isMobile ? "72px" : "150px",
          height: isMobile ? "72px" : "170px",
          borderRadius: "12px",
          backgroundColor: isRunning
            ? "var(--success-color)"
            : "var(--surface-color)",
          color: isRunning ? "#fff" : "var(--text-primary)",
          border: isRunning ? "none" : "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          marginBottom: isMobile ? "4px" : "15px",
          padding: isMobile ? "6px" : "12px",
          cursor: "default",
        };

        return (
          <div
            key={mill.id || mill.millName}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "15px" : "24px",
                fontWeight: "bold",
                marginBottom: isMobile ? "0" : "8px",
                lineHeight: 1.1,
              }}
            >
              {mill.millName}
            </h3>

            {!isMobile ? (
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "8px",
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                }}
              >
                {isRunning ? "RUNNING" : "STOPPED"}
              </p>
            ) : null}
            {!isMobile ? (
              <small
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                  marginBottom: "4px",
                }}
              >
                {isRunning ? "Running since:" : "Stopped since:"}{" "}
                {formatReadableDate(sinceValue)}
              </small>
            ) : null}

            {!isMobile ? (
              <small
                style={{ fontSize: "12px", opacity: 0.85, marginBottom: "6px" }}
              >
                {formatReadableTime(sinceValue)}
              </small>
            ) : null}

            {!isMobile ? (
              <small style={{ fontSize: "11px", opacity: 0.8 }}>
                {mill.createdBy || "--"}
              </small>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
