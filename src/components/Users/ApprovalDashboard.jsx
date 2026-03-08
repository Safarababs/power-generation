import React, { useEffect, useState } from "react";
import { db } from "../FIrestore/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const ApprovalDashboard = ({ currentUser }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  // ✅ Helper: who can approve
  const canApprove =
    currentUser?.department === "operation" &&
    (currentUser?.designation === "developer" ||
      currentUser?.designation === "MO");

  // Fetch all users with approved === false
  useEffect(() => {
    const fetchPendingUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "teamMembers"));
      const users = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data.approved) {
          users.push({ id: docSnap.id, ...data });
        }
      });
      setPendingUsers(users);
    };
    fetchPendingUsers();
  }, []);

  // Approve user
  const approveUser = async (userId) => {
    if (!canApprove) {
      alert("Only Developer or Manager-Operation can approve registrations.");
      return;
    }
    await updateDoc(doc(db, "teamMembers", userId), { approved: true });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    alert("User approved!");
  };

  return (
    <div className="card">
      {" "}
      <div className="card-content">
        <div className="card-header">
          <h2 className="card-title">Approval Dashboard</h2>
          <p className="text-sm text-secondary">
            Review and approve pending user registrations.
          </p>
        </div>

        <div className="overflow-x-auto">
          {pendingUsers.length === 0 ? (
            <p>No pending users 🎉</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Emp Number</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.designation}</td>
                    <td>{user.department}</td>
                    <td>{user.empNumber}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className={`btn ${
                          canApprove
                            ? "btn-success"
                            : "btn-danger opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => approveUser(user.id)}
                        disabled={!canApprove}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalDashboard;
