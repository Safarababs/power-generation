import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";

const UnapprovedSops = () => {
  const [sops, setSops] = useState([]);
  const [totalSops, setTotalSops] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState({
    sopId: null,
    stepIndex: null,
    detailIndex: null,
  });

  useEffect(() => {
    const fetchSops = async () => {
      try {
        const allSnapshot = await getDocs(collection(db, "sops"));
        setTotalSops(allSnapshot.size);

        const unapprovedQuery = query(
          collection(db, "sops"),
          where("isApproved", "==", false),
        );
        const unapprovedSnapshot = await getDocs(unapprovedQuery);

        const sopList = unapprovedSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            objective: data.objective || "",
            steps: data.steps || [],
            safetyNotes: data.safetyNotes || [],
          };
        });

        setSops(sopList);
        if (sopList.length > 0) setOpenId(sopList[0].id);
      } catch (err) {
        console.error("Error fetching SOPs:", err);
      }
    };

    fetchSops();
  }, []);

  const filteredSops = sops.filter((sop) =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Save heading or detail
  const saveStep = async (sopId, stepIndex, newHeading) => {
    try {
      const sopRef = doc(db, "sops", sopId);
      const sop = sops.find((s) => s.id === sopId);
      const newSteps = [...sop.steps];
      newSteps[stepIndex].heading = newHeading;

      await updateDoc(sopRef, { steps: newSteps });
      setSops((prev) =>
        prev.map((s) => (s.id === sopId ? { ...s, steps: newSteps } : s)),
      );
      setEditing({ sopId: null, stepIndex: null, detailIndex: null });
    } catch (err) {
      console.error("Error saving step:", err);
    }
  };

  const saveDetail = async (sopId, stepIndex, detailIndex, newDetail) => {
    try {
      const sopRef = doc(db, "sops", sopId);
      const sop = sops.find((s) => s.id === sopId);
      const newSteps = [...sop.steps];
      newSteps[stepIndex].details[detailIndex] = newDetail;

      await updateDoc(sopRef, { steps: newSteps });
      setSops((prev) =>
        prev.map((s) => (s.id === sopId ? { ...s, steps: newSteps } : s)),
      );
      setEditing({ sopId: null, stepIndex: null, detailIndex: null });
    } catch (err) {
      console.error("Error saving detail:", err);
    }
  };

  const deleteStep = async (sopId, stepIndex) => {
    try {
      const sopRef = doc(db, "sops", sopId);
      const sop = sops.find((s) => s.id === sopId);
      const newSteps = sop.steps.filter((_, idx) => idx !== stepIndex);

      await updateDoc(sopRef, { steps: newSteps });
      setSops((prev) =>
        prev.map((s) => (s.id === sopId ? { ...s, steps: newSteps } : s)),
      );
    } catch (err) {
      console.error("Error deleting step:", err);
    }
  };

  const saveSafetyNote = async (sopId, noteIndex, newNote) => {
    try {
      const sopRef = doc(db, "sops", sopId);
      const sop = sops.find((s) => s.id === sopId);
      const newNotes = [...sop.safetyNotes];
      newNotes[noteIndex] = newNote;

      await updateDoc(sopRef, { safetyNotes: newNotes });

      setSops((prev) =>
        prev.map((s) => (s.id === sopId ? { ...s, safetyNotes: newNotes } : s)),
      );
      setEditing({ sopId: null, stepIndex: null, detailIndex: null });
    } catch (err) {
      console.error("Error saving safety note:", err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">All SOPs</h2>
        {totalSops > 0 && <p>{totalSops} SOPs exist but need approval.</p>}
        <input
          type="text"
          placeholder="Search SOP..."
          className="border p-2 rounded w-full mt-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-content">
        {filteredSops.length === 0 ? (
          <p className="text-red font-semibold mt-4">
            {totalSops} SOPs exist but need approval.
          </p>
        ) : (
          filteredSops.map((sop) => (
            <div key={sop.id} className="mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{sop.title}</span>
                <button
                  onClick={() => setOpenId(openId === sop.id ? null : sop.id)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  {openId === sop.id ? <FaMinus /> : <FaPlus />}
                </button>
              </div>

              {openId === sop.id && (
                <div className="sop-content open">
                  {sop.objective && (
                    <p className="text-secondary mb-2">
                      <strong>Objective:</strong> {sop.objective}
                    </p>
                  )}

                  {Array.isArray(sop.steps) && sop.steps.length > 0 && (
                    <ol className="sop-steps list-decimal ml-6 mt-2">
                      {sop.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-start"
                        >
                          <div>
                            {/* Step heading */}
                            {editing.sopId === sop.id &&
                            editing.stepIndex === idx &&
                            editing.detailIndex === null ? (
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  defaultValue={step.heading}
                                  onChange={(e) =>
                                    setEditing({
                                      ...editing,
                                      newValue: e.target.value,
                                    })
                                  }
                                  className="form-input"
                                />
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    saveStep(sop.id, idx, editing.newValue)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() =>
                                    setEditing({
                                      sopId: null,
                                      stepIndex: null,
                                      detailIndex: null,
                                    })
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <strong>{step.heading}</strong>
                            )}

                            {/* Step details */}
                            {Array.isArray(step.details) &&
                              step.details.length > 0 && (
                                <ul className="ml-4 list-disc">
                                  {step.details.map((d, dIdx) => (
                                    <li
                                      key={dIdx}
                                      className="flex justify-between items-center"
                                    >
                                      {editing.sopId === sop.id &&
                                      editing.stepIndex === idx &&
                                      editing.detailIndex === dIdx ? (
                                        <div className="flex space-x-2 list-edit-container">
                                          <input
                                            type="text"
                                            defaultValue={d}
                                            onChange={(e) =>
                                              setEditing({
                                                ...editing,
                                                newValue: e.target.value,
                                              })
                                            }
                                            className="form-input list-edit-input"
                                          />
                                          <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                              saveDetail(
                                                sop.id,
                                                idx,
                                                dIdx,
                                                editing.newValue,
                                              )
                                            }
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                              setEditing({
                                                sopId: null,
                                                stepIndex: null,
                                                detailIndex: null,
                                              })
                                            }
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <span>{d}</span>
                                      )}
                                      <button
                                        className="btn btn-secondary ml-2"
                                        onClick={() =>
                                          setEditing({
                                            sopId: sop.id,
                                            stepIndex: idx,
                                            detailIndex: dIdx,
                                            newValue: d,
                                          })
                                        }
                                      >
                                        Edit
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                          <div className="ml-4 space-x-2">
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                setEditing({
                                  sopId: sop.id,
                                  stepIndex: idx,
                                  detailIndex: null,
                                  newValue: step.heading,
                                })
                              }
                            >
                              Edit Heading
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteStep(sop.id, idx)}
                            >
                              Delete Step
                            </button>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {Array.isArray(sop.safetyNotes) &&
                    sop.safetyNotes.length > 0 && (
                      <>
                        <h4 className="mt-4 font-semibold">Safety Notes</h4>
                        <ul className="ml-6 list-disc text-red">
                          {sop.safetyNotes.map((note, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              {editing.sopId === sop.id &&
                              editing.stepIndex === null &&
                              editing.detailIndex === idx ? (
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    defaultValue={note}
                                    onChange={(e) =>
                                      setEditing({
                                        ...editing,
                                        newValue: e.target.value,
                                      })
                                    }
                                    className="form-input"
                                  />
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      saveSafetyNote(
                                        sop.id,
                                        idx,
                                        editing.newValue,
                                      )
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                      setEditing({
                                        sopId: null,
                                        stepIndex: null,
                                        detailIndex: null,
                                      })
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span>{note}</span>
                              )}
                              <button
                                className="btn btn-secondary ml-2"
                                onClick={() =>
                                  setEditing({
                                    sopId: sop.id,
                                    stepIndex: null,
                                    detailIndex: idx,
                                    newValue: note,
                                  })
                                }
                              >
                                Edit
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnapprovedSops;
