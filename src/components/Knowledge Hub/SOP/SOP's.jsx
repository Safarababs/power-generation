import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";

const SOPsComponent = () => {
  const [sops, setSops] = useState([]);
  const [totalSops, setTotalSops] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSops = async () => {
      try {
        // ✅ Get all SOPs
        const allSnapshot = await getDocs(collection(db, "sops"));
        setTotalSops(allSnapshot.size);

        // ✅ Get only approved SOPs
        const approvedQuery = query(
          collection(db, "sops"),
          where("isApproved", "==", true),
        );
        const approvedSnapshot = await getDocs(approvedQuery);

        const sopList = approvedSnapshot.docs.map((doc) => {
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

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">All SOPs</h2>

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
          <p className="text-red font-semibold mt-4">{totalSops} SOPs exist.</p>
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
          ))
        )}
      </div>
    </div>
  );
};

export default SOPsComponent;
