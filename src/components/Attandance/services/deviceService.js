import { db } from "../../FIrestore/firebase";
import { doc, setDoc } from "firebase/firestore";

// Register device for employee
export const registerDevice = async (employeeId) => {
  // Generate unique visitorId
  const visitorId = "device_" + Math.random().toString(36).substring(2, 15);
  const platform = navigator.userAgent;
  const registeredAt = new Date();

  // Save in Firestore
  await setDoc(doc(db, "employees_devices", visitorId), {
    employeeId,
    visitorId,
    platform,
    registeredAt,
    approved: true,
  });

  // Save visitorId in localStorage to persist across sessions
  localStorage.setItem("visitorId", visitorId);

  return `Device registered ✅ Visitor ID: ${visitorId}`;
};

// Get device fingerprint
export const getDeviceFingerprint = async () => {
  // Get visitorId from localStorage
  const visitorId = localStorage.getItem("visitorId");

  if (visitorId) {
    return {
      visitorId,
      platform: navigator.userAgent,
    };
  }

  // If not registered yet
  return {
    visitorId: "unregistered_device",
    platform: navigator.userAgent,
  };
};
