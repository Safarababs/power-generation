import React from "react";
import millData from "./Feeders Tripping Record.json"; // import your local JSON file

function MillRecordsHumanReadable() {
  const [converted, setConverted] = React.useState([]);

  // Convert Firestore timestamp to ISO string
  const toDate = (ts) =>
    new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6).toISOString();

  // Process records
  const processRecords = () => {
    const processed = millData.map((r) => ({
      ...r,
      startTime: toDate(r.startTime),
      stopTime: toDate(r.stopTime),
      createdAt: toDate(r.createdAt),
    }));

    // Sort mill-wise, then date-wise
    processed.sort((a, b) => {
      if (a.mill !== b.mill) return a.mill.localeCompare(b.mill);
      return new Date(a.startTime) - new Date(b.startTime);
    });

    setConverted(processed);
  };

  // Save JSON file
  const saveJson = () => {
    const blob = new Blob([JSON.stringify(converted, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mill_records_human.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mill Records Human Readable</h2>
      <button onClick={processRecords} className="btn btn-primary p-4 m-4">
        Convert Records
      </button>
      {converted.length > 0 && (
        <>
          <button onClick={saveJson} className="btn btn-primary p-4 m-4">
            Save JSON
          </button>
          <pre style={{ marginTop: "20px", textAlign: "left" }}>
            {JSON.stringify(converted, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default MillRecordsHumanReadable;
