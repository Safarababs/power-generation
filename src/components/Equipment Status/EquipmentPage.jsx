import React, { useState } from "react";
import EquipmentSelector from "./EquipmentSelector";
import EquipmentForm from "./EquipmentForm";

export default function EquipmentPage() {
  const [selectedEquipment, setSelectedEquipment] = useState("");

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT */}
      <EquipmentForm selectedEquipment={selectedEquipment} />

      {/* RIGHT */}
      <EquipmentSelector onSelect={setSelectedEquipment} />
    </div>
  );
}
