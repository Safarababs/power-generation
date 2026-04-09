import React, { useState } from "react";
import { EQUIPMENT_LIST } from "./equipmentList";

export default function EquipmentSelector({ onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = EQUIPMENT_LIST.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="card p-4">
      <h3>Select Equipment</h3>

      <input
        type="text"
        placeholder="Search..."
        className="form-input mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {filtered.map((item, index) => (
          <div
            key={index}
            className="p-2 border cursor-pointer"
            onClick={() => onSelect(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
