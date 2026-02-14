import { db } from "../../FIrestore/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const fetchAttendanceRecords = async () => {
  const q = query(
    collection(db, "attendance_records"),
    orderBy("timestamp", "desc"),
  );
  const snapshot = await getDocs(q);
  const records = [];
  snapshot.forEach((doc) => records.push({ id: doc.id, ...doc.data() }));
  return records;
};
