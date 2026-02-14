import { db } from "../../FIrestore/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDeviceFingerprint } from "../services/deviceService";

export const useDeviceValidation = () => {
  const checkDevice = async (employeeId) => {
    const device = await getDeviceFingerprint();
    const docRef = doc(db, "employees_devices", device.visitorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.approved && data.employeeId === employeeId;
    }
    return false;
  };

  return { checkDevice };
};
