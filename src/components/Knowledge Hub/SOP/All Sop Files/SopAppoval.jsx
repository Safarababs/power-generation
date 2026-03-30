import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

const DepartmentSOPApproval = ({ currentUser }) => {
  const [sops, setSops] = useState([]);

  useEffect(() => {
    const fetchSops = async () => {
      try {
        // ✅ Only fetch SOPs for this department
        const q = query(
          collection(db, "sops"),
          where("createdBy.department", "==", currentUser.department),
        );
        const snapshot = await getDocs(q);
        const sopList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSops(sopList);
      } catch (err) {
        console.error("Error fetching SOPs:", err);
      }
    };
    fetchSops();
  }, [currentUser.department]);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "sops", id), {
        isApproved: true,
        approvedBy: {
          name: currentUser?.name,
          email: currentUser?.email,
          department: currentUser?.department,
          empNumber: currentUser?.empNumber,
          approvedAt: new Date(),
        },
      });
      alert("SOP approved successfully!");
      setSops((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                isApproved: true,
                approvedBy: {
                  name: currentUser?.name,
                  email: currentUser?.email,
                  department: currentUser?.department,
                  empNumber: currentUser?.empNumber,
                  approvedAt: new Date(),
                },
              }
            : s,
        ),
      );
    } catch (err) {
      console.error("Error approving SOP:", err);
    }
  };

  const pendingSops = sops.filter((sop) => !sop.isApproved);

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">
        SOPs Pending Approval ({currentUser.department})
      </h2>
      {pendingSops.length === 0 ? (
        <p>No SOPs found.</p>
      ) : (
        <ul className="list-disc ml-6">
          {pendingSops.map((sop) => (
            <li key={sop.id} className="mb-4">
              <strong>{sop.title}</strong> – {sop.objective}
              <div className="mt-2">
                <button
                  onClick={() => handleApprove(sop.id)}
                  className="btn btn-success m-1"
                >
                  Approve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentSOPApproval;
