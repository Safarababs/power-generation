import React from "react";
import MillStatusForm from "./MillStatusForm";
import MillStatusBoard from "./MillStatusBoard";

export default function MillMonitoringPage({ currentUser }) {
  return (
    <div className="page-content">
      <div className="container">
        <MillStatusForm currentUser={currentUser} />
        <MillStatusBoard />
      </div>
    </div>
  );
}
