import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

const DepartmentSOPApproval = ({ currentUser }) => {
  const [sops, setSops] = useState([]);

  useEffect(() => {
    const fetchSops = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sops"));
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
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "sops", id), {
        isApproved: true,
        approvedBy: {
          name: currentUser?.name,
          email: currentUser?.email,
          department: currentUser?.department,
          empNumber: currentUser?.empNumber,
          approvedAt: new Date(), // optional timestamp
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

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">
        SOPs Pending Approval ({currentUser.department})
      </h2>
      {sops.filter(
        (sop) => sop.createdBy?.department === currentUser.department,
      ).length === 0 ? (
        <p>No SOPs found.</p>
      ) : (
        <ul className="list-disc ml-6">
          {sops
            .filter(
              (sop) => sop.createdBy?.department === currentUser.department,
            )
            .map((sop) => (
              <li key={sop.id} className="mb-4">
                <strong>{sop.title}</strong> – {sop.objective}
                <div className="mt-2">
                  {!sop.isApproved && (
                    <button
                      onClick={() => handleApprove(sop.id)}
                      className="btn btn-success m-1"
                    >
                      Approve
                    </button>
                  )}
                  {sop.isApproved && (
                    <span className="text-green ml-2">Approved</span>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentSOPApproval;
