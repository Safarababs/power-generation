import React from "react";
import { registerDevice } from "../services/deviceService";
import { useDeviceValidation } from "../hooks/useDeviceValidation";
import { useNetworkValidation } from "../hooks/useNetworkValidation";
import { useGPSValidation } from "../hooks/useGPSValidation";
import { markAttendance } from "../services/attendanceService";
import AttendanceDashboard from "./AttendanceDashboard";

const MarkAttendance = () => {
  const employeeId = "EMP1023";

  const { checkDevice } = useDeviceValidation();
  const { checkNetwork } = useNetworkValidation();
  const { checkGPS } = useGPSValidation();

  const handleAttendance = async () => {
    try {
      if (!(await checkDevice(employeeId)))
        return alert("Unauthorized Device ❌");
      if (!(await checkNetwork()))
        return alert("Not connected to plant Wi-Fi ❌");
      if (!(await checkGPS()))
        return alert("You are not in allowed location ❌");

      await markAttendance(employeeId);
      alert("Attendance Marked ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeviceRegistration = async () => {
    try {
      const res = await registerDevice(employeeId);
      alert(res);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h2>Attendance Panel</h2>
        <p>Employee ID: {employeeId}</p>
        <button onClick={handleAttendance} style={{ marginRight: "1rem" }}>
          Mark Attendance
        </button>
        <button onClick={handleDeviceRegistration}>Register Device</button>
      </div>
      <AttendanceDashboard />
    </>
  );
};

export default MarkAttendance;
