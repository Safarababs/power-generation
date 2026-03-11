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
        const sopList = snapshot.docs.map((doc, idx) => ({
          id: doc.id, // document ID = SOP title
          title: doc.data().title,
          steps: doc.data().steps || [],
        }));
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
        <h2 className="card-title">Standard Operating Procedures</h2>
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
              <div className={`sop-content ${openId === sop.id ? "open" : ""}`}>
                <ol className="sop-steps list-decimal ml-6 mt-2">
                  {sop.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOPsComponent;
