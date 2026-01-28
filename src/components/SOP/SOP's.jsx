import React, { useState } from "react";
import sops from "./All Sop Files/sops";
import { FaPlus, FaMinus } from "react-icons/fa";

const SOPsComponent = () => {
  const [openId, setOpenId] = useState(1); // first SOP open by default
  const [searchTerm, setSearchTerm] = useState("");

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

            {/* Show content only if this SOP is open */}
            {openId === sop.id && (
              <div className="mt-2 text-sm text-secondary">{sop.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOPsComponent;
