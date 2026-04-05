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

          department: currentUser?.department,

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

                  department: currentUser?.department,

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
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          SOPs Pending Approval ({currentUser.department})
        </h2>
        {pendingSops.length === 0 ? (
          <p>No SOPs found.</p>
        ) : (
          <div className="card-content">
            <ul className="list-decimal ml-6">
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
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default DepartmentSOPApproval;
