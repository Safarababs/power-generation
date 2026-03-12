import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";

const SOPsComponent = () => {
  const [sops, setSops] = useState([]);
  const [openId, setOpenId] = useState(null); // no SOP open initially
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch SOPs from Firestore
  useEffect(() => {
    const fetchSops = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sops"));
        const sopList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            objective: data.objective || "",
            steps: data.steps || [],
            safetyNotes: data.safetyNotes || [],
          };
        });
        setSops(sopList);
        if (sopList.length > 0) setOpenId(sopList[0].id); // open first SOP by default
      } catch (err) {
        console.error("Error fetching SOPs:", err);
      }
    };
    fetchSops();
  }, []);

  // ✅ Filter SOPs based on search term
  const filteredSops = sops.filter((sop) =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Standard Operating Procedures's (SOP's)</h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search SOP..."
          className="border p-2 rounded w-full mt-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-content">
        {filteredSops.map((sop) => (
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

            {/* Show steps only if this SOP is open */}
            {openId === sop.id && (
              <div className="sop-content open">
                {/* Objective */}
                {sop.objective && (
                  <p className="text-secondary mb-2">
                    <strong>Objective:</strong> {sop.objective}
                  </p>
                )}

                {/* Steps */}
                {Array.isArray(sop.steps) && sop.steps.length > 0 && (
                  <ol className="sop-steps list-decimal ml-6 mt-2">
                    {sop.steps.map((step, idx) => (
                      <li key={idx}>
                        <strong>{step.heading}</strong>
                        {Array.isArray(step.details) &&
                          step.details.length > 0 && (
                            <ul className="ml-4 list-disc">
                              {step.details.map((d, dIdx) => (
                                <li key={dIdx}>{d}</li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ol>
                )}

                {/* Safety Notes */}
                {Array.isArray(sop.safetyNotes) &&
                  sop.safetyNotes.length > 0 && (
                    <>
                      <h4 className="mt-4 font-semibold">Safety Notes</h4>
                      <ul className="ml-6 list-disc text-red">
                        {sop.safetyNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOPsComponent;
