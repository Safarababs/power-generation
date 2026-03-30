import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SOPPDF from "./SOPPDF";

const PAGE_SIZE = 10;

const SOPsComponent = () => {
  const [sops, setSops] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchSops = async () => {
      try {
        const q = query(
          collection(db, "sops"),
          where("isApproved", "==", true),
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
  }, []);

  // ✅ Filter SOPs by search term
  const filteredSops = sops.filter((sop) =>
    sop.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Slice visible items
  const visibleSops = filteredSops.slice(0, visibleCount);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Approved SOPs</h2>
        <input
          type="text"
          placeholder="Search SOP..."
          className="border p-2 rounded w-full mt-2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(PAGE_SIZE); // reset pagination on new search
          }}
        />
      </div>

      <div className="card-content">
        {visibleSops.length === 0 ? (
          <p className="text-secondary">No approved SOPs found.</p>
        ) : (
          visibleSops.map((sop) => (
            <div key={sop.id} className="mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{sop.title}</span>
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

              {openId === sop.id && (
                <div className="sop-content open">
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

        {/* ✅ Load More button (client-side only) */}
        {visibleCount < filteredSops.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="btn-primary"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOPsComponent;
