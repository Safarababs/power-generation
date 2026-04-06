import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../../FIrestore/firebase";

const UnapprovedSops = ({ currentUser }) => {
  const [sopList, setSopList] = useState([]);
  const [filteredSops, setFilteredSops] = useState([]);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [originalSOP, setOriginalSOP] = useState(null); // ✅ IMPORTANT

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [steps, setSteps] = useState([{ heading: "", details: [""] }]);
  const [safetyNotes, setSafetyNotes] = useState([""]);

  // ---------------- FETCH UNAPPROVED SOPs ----------------
  const fetchSOPs = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "sops"), where("isApproved", "==", false)), // ✅ FIXED
      );

      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSopList(list);
      setFilteredSops(list);
    } catch (err) {
      console.error(err);
      alert("Error fetching SOPs");
    }
  }, []);

  useEffect(() => {
    fetchSOPs();
  }, [fetchSOPs]);

  // ---------------- FILTER ----------------
  useEffect(() => {
    const filtered = sopList.filter((sop) =>
      sop.title.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredSops(filtered);
  }, [search, sopList]);

  // ---------------- LOAD SOP ----------------
  const loadSOP = (id) => {
    const sop = sopList.find((s) => s.id === id);
    if (!sop) return;

    setSelectedSOP(id);
    setOriginalSOP(sop); // ✅ KEEP ORIGINAL DATA

    setTitle(sop.title || "");
    setObjective(sop.objective || "");
    setSteps(sop.steps?.length ? sop.steps : [{ heading: "", details: [""] }]);
    setSafetyNotes(sop.safetyNotes?.length ? sop.safetyNotes : [""]);
  };

  // ---------------- SAVE (SAFE MERGE) ----------------
  const saveSOP = async () => {
    try {
      const ref = doc(db, "sops", selectedSOP);

      await setDoc(ref, {
        ...originalSOP, // ✅ KEEP OLD DATA

        // ✅ UPDATE ONLY EDITED FIELDS
        title,
        objective,
        steps,
        safetyNotes,

        // ✅ FORCE RULES
        isApproved: false,
        updatedAt: new Date(),
      });

      alert("SOP updated successfully!");
      fetchSOPs();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // ---------------- STEP FUNCTIONS ----------------
  const addSection = () => setSteps([...steps, { heading: "", details: [""] }]);

  const updateStepHeading = (i, val) => {
    const s = [...steps];
    s[i].heading = val;
    setSteps(s);
  };

  const updateDetail = (i, j, val) => {
    const s = [...steps];
    s[i].details[j] = val;
    setSteps(s);
  };

  const addDetail = (i) => {
    const s = [...steps];
    s[i].details.push("");
    setSteps(s);
  };

  const deleteStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const deleteDetail = (i, j) => {
    const s = [...steps];
    s[i].details.splice(j, 1);
    if (s[i].details.length === 0) s[i].details = [""];
    setSteps(s);
  };

  // ---------------- SAFETY NOTES ----------------
  const addNote = () => setSafetyNotes([...safetyNotes, ""]);

  const updateNote = (i, val) => {
    const n = [...safetyNotes];
    n[i] = val;
    setSafetyNotes(n);
  };

  const deleteNote = (i) =>
    setSafetyNotes(safetyNotes.filter((_, idx) => idx !== i));

  // ---------------- UI ----------------
  let totalSops = 0;
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT SIDE */}
      <div className="card p-4">
        <h2 className="card-title">Unapproved SOPs {totalSops}</h2>

        <input
          type="text"
          placeholder="Search SOP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input w-full mb-2"
        />

        {filteredSops.map((sop) =>
          sop.createdBy?.department === currentUser.department ? (
            <div key={sop.id} className="flex justify-between border p-2 mt-2">
              <span onClick={() => loadSOP(sop.id)} className="cursor-pointer">
                {sop.title} {totalSops++}
              </span>
            </div>
          ) : null,
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="card p-4">
        {selectedSOP ? (
          <>
            <h2 className="card-title">Edit SOP</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full mb-2"
              placeholder="SOP Title"
            />

            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="form-input w-full mb-4"
              placeholder="Objective"
            />

            {steps.map((step, i) => (
              <div key={i} className="border p-2 mt-2">
                <input
                  value={step.heading}
                  onChange={(e) => updateStepHeading(i, e.target.value)}
                  className="form-input w-full"
                  placeholder={`Section ${i + 1}`}
                />

                {step.details.map((d, j) => (
                  <div key={j} className="flex gap-2 mt-1">
                    <input
                      value={d}
                      onChange={(e) => updateDetail(i, j, e.target.value)}
                      className="form-input w-full"
                    />
                    <button
                      onClick={() => deleteDetail(i, j)}
                      className="btn btn-danger"
                    >
                      X
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => addDetail(i)}
                    className="btn btn-secondary"
                  >
                    + Step
                  </button>
                  <button
                    onClick={() => deleteStep(i)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addSection} className="btn btn-secondary mt-2">
              + Section
            </button>

            <h3 className="mt-4">Safety Notes</h3>

            {safetyNotes.map((n, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input
                  value={n}
                  onChange={(e) => updateNote(i, e.target.value)}
                  className="form-input w-full"
                />
                <button
                  onClick={() => deleteNote(i)}
                  className="btn btn-danger"
                >
                  X
                </button>
              </div>
            ))}

            <button onClick={addNote} className="btn btn-secondary mt-2">
              + Note
            </button>

            <button onClick={saveSOP} className="btn btn-primary mt-4">
              Save Changes
            </button>
          </>
        ) : (
          <p>Select an SOP to edit</p>
        )}
      </div>
    </div>
  );
};

export default UnapprovedSops;
