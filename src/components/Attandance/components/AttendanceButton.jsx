import React from "react";

const AttendanceButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Mark Attendance
    </button>
  );
};

export default AttendanceButton;
