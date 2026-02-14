import { db } from "../../FIrestore/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getDeviceFingerprint } from "./deviceService";
import { getUserIP } from "./networkService";
import { getCurrentPosition } from "./gpsService";

const getShift = () => {
  const h = new Date().getHours();
  if (h >= 7 && h < 14) return "Morning";
  if (h >= 14 && h < 22) return "Evening";
  if (h >= 22 || h < 7) return "Night";
  return "General";
};

const checkDuplicateAttendance = async (employeeId, shift) => {
  const q = query(
    collection(db, "attendance_records"),
    where("employeeId", "==", employeeId),
    where("shift", "==", shift),
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const markAttendance = async (employeeId) => {
  const device = await getDeviceFingerprint();
  const networkIP = await getUserIP();
  const shift = getShift();

  const isDuplicate = await checkDuplicateAttendance(employeeId, shift);
  if (isDuplicate) throw new Error(`Attendance already marked for ${shift}`);

  let latitude = null;
  let longitude = null;
  try {
    const coords = await getCurrentPosition();
    latitude = coords.latitude;
    longitude = coords.longitude;
  } catch (err) {
    console.warn("GPS not available:", err.message);
  }

  await addDoc(collection(db, "attendance_records"), {
    employeeId,
    deviceId: device.visitorId,
    platform: device.platform,
    networkIP,
    latitude,
    longitude,
    shift,
    status: "present",
    timestamp: new Date(),
  });

  return "Attendance stored ✅";
};
