import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SOPPDF from "./SOPPDF";

const SOPsComponent = ({ currentUser }) => {
  const [sops, setSops] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSops = async () => {
      try {
        // ✅ Guard rendering until currentUser is ready
        if (!currentUser) {
          return <p>Loading user...</p>;
        }
        if (!currentUser) return; // ✅ guard inside effect

        let q;
        if (currentUser.department === "executive") {
          q = query(collection(db, "sops"), where("isApproved", "==", true));
        } else {
          q = query(
            collection(db, "sops"),
            where("isApproved", "==", true),
            where("createdBy.department", "==", currentUser.department),
          );
        }

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
  }, [currentUser]);

  const filteredSops = sops.filter((sop) =>
    sop.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Approved SOPs</h2>
        <p>{filteredSops.length} SOPs found</p>
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
          <p className="text-secondary">No approved SOPs found.</p>
        ) : (
          filteredSops.map((sop) => (
            <div key={sop.id} className="mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{sop.title}</span>
                <div>
                  <button
                    onClick={() => setOpenId(openId === sop.id ? null : sop.id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    {openId === sop.id ? <FaMinus /> : <FaPlus />}
                  </button>
                  <PDFDownloadLink
                    document={<SOPPDF sop={sop} />}
                    fileName={`${sop.title.replace(/\s+/g, "_")}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        <span className="text-gray-500">Preparing...</span>
                      ) : (
                        <button className="btn-primary text-sm">
                          Download PDF
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                </div>
              </div>

              {openId === sop.id && (
                <div className="sop-content open mt-2">
                  {sop.objective && (
                    <p className="text-secondary mb-2">
                      <strong>Objective:</strong> {sop.objective}
                    </p>
                  )}
                  {Array.isArray(sop.steps) && sop.steps.length > 0 && (
                    <ol className="list-decimal ml-6 mt-2">
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
