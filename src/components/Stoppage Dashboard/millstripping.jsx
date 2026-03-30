import React, { useEffect, useState } from "react";
import { db } from "../FIrestore/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

const MillRecordsTable = ({ currentUser }) => {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    mill: "",
    stopTime: "",
    startTime: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate start and end of today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const q = query(
          collection(db, "millRecords"),
          where("createdAt", ">=", startOfDay),
          where("createdAt", "<=", endOfDay),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          const stop = d.stopTime?.toDate();
          const start = d.startTime?.toDate();

          const dateFormatter = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          let totalStop = null;
          if (stop && start) {
            let diffMs = start - stop;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const diffHours = diffMs / (1000 * 60 * 60);
            totalStop = diffHours.toFixed(2) + " hrs";
          }

          return {
            id: doc.id,
            mill: d.mill,
            stopTime: stop
              ? `${dateFormatter.format(stop)} ${stop.toLocaleTimeString()}`
              : "",
            startTime: start
              ? `${dateFormatter.format(start)} ${start.toLocaleTimeString()}`
              : "",
            totalStop,
            rawStop: stop,
            rawStart: start,
          };
        });

        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Helper: who can edit
  const canEdit =
    currentUser?.department === "uty" ||
    (currentUser?.department === "operation" &&
      (currentUser?.designation === "developer" ||
        currentUser?.designation === "Office Assistant"));

  const handleEdit = (rec) => {
    setEditingId(rec.id);
    setEditData({
      mill: rec.mill,
      stopTime: rec.rawStop?.toISOString().slice(0, 16),
      startTime: rec.rawStart?.toISOString().slice(0, 16),
    });
  };

  const handleUpdate = async () => {
    try {
      const ref = doc(db, "millRecords", editingId);
      await updateDoc(ref, {
        mill: editData.mill,
        stopTime: new Date(editData.stopTime),
        startTime: new Date(editData.startTime),
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, "millRecords", id));
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">Mill Records</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Mill Name</th>
              <th>Stop Time</th>
              <th>Start Time</th>

              <th>Total Stop Time</th>
              {canEdit ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                {editingId === rec.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData.mill}
                        onChange={(e) =>
                          setEditData({ ...editData, mill: e.target.value })
                        }
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={editData.stopTime}
                        onChange={(e) =>
                          setEditData({ ...editData, stopTime: e.target.value })
                        }
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={editData.startTime}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            startTime: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </td>
                    <td>{rec.createdAt}</td>
                    <td>{rec.totalStop}</td>
                    <td>
                      (
                      <button
                        onClick={handleUpdate}
                        className="btn btn-success m-1"
                      >
                        Save
                      </button>
                      ) (
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-warning m-1"
                      >
                        Cancel
                      </button>
                      )
                    </td>
                  </>
                ) : (
                  <>
                    <td>{rec.mill}</td>
                    <td>{rec.stopTime}</td>
                    <td>{rec.startTime}</td>
                    <td>{rec.totalStop}</td>

                    <td>
                      {canEdit ? (
                        <button
                          onClick={() => handleEdit(rec)}
                          className="btn btn-primary m-1"
                        >
                          Edit
                        </button>
                      ) : null}
                      {canEdit ? (
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="btn btn-danger m-1"
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MillRecordsTable;
