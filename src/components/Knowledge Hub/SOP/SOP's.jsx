import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../FIrestore/firebase";
import { FaPlus, FaMinus } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SOPPDF from "./SOPPDF";

const PAGE_SIZE = 10;

const SOPsComponent = () => {
  const [sops, setSops] = useState([]);
  const [totalSops, setTotalSops] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchSops = useCallback(
    async (reset = false) => {
      try {
        let q;
        if (lastDoc && !reset) {
          q = query(
            collection(db, "sops"),
            where("isApproved", "==", true),

            startAfter(lastDoc),
            limit(PAGE_SIZE),
          );
        } else {
          q = query(
            collection(db, "sops"),
            where("isApproved", "==", true),

            limit(PAGE_SIZE),
          );
        }

        const snapshot = await getDocs(q);
        const sopList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (reset) {
          setSops(sopList);
          setTotalSops(sopList.length);
        } else {
          setSops((prev) => [...prev, ...sopList]);
          setTotalSops((prev) => prev + sopList.length);
        }

        if (snapshot.docs.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
      } catch (err) {
        console.error("Error fetching SOPs:", err);
      }
    },
    [lastDoc],
  );

  useEffect(() => {
    fetchSops(true);
  }, [fetchSops]);

  const filteredSops = sops.filter((sop) =>
    sop.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Approved SOPs</h2>
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
            {totalSops} SOPs loaded.
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

        {hasMore && (
          <div className="flex justify-center mt-4">
            <button onClick={() => fetchSops()} className="btn-primary">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOPsComponent;
