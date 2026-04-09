import React, { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../FIrestore/firebase";
import "./equipmentStatus.css";

const MODE_OPTIONS = [
  { value: "R", label: "R (Running)" },
  { value: "SB", label: "SB (Stand By)" },
  { value: "UM", label: "UM (Under Maintenance)" },
  { value: "A", label: "A (Auto)" },
  { value: "M", label: "M (Manual)" },
];

const STATUS_OPTIONS = ["Ok", "Warning", "Critical"];

export default function EquipmentForm({ selectedEquipment }) {
  const [formData, setFormData] = useState({
    equipmentName: "",
    mode: "R",
    status: "Ok",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      equipmentName: selectedEquipment || "",
    }));
  }, [selectedEquipment]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.equipmentName) {
      setMessage("Please select equipment from the right window.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await addDoc(collection(db, "equipment_status"), {
        equipmentName: formData.equipmentName,
        mode: formData.mode,
        status: formData.status,
        remarks: formData.remarks,
        createdAt: serverTimestamp(),
      });

      setMessage("Equipment status submitted successfully.");

      setFormData((prev) => ({
        ...prev,
        mode: "R",
        status: "Ok",
        remarks: "",
      }));
    } catch (error) {
      console.error(error);
      setMessage("Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eqs-card">
      <div className="eqs-card-header">
        <h3 className="eqs-title">Plant Equipment Status Form</h3>
        <p className="eqs-subtitle">Submit equipment operating information</p>
      </div>

      <div className="eqs-card-body">
        {message && <div className="eqs-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="eqs-form-group">
            <label className="eqs-label">Equipment Name</label>
            <input
              type="text"
              className="eqs-input"
              value={formData.equipmentName}
              placeholder="Select from second window"
              readOnly
            />
          </div>

          <div className="eqs-form-group">
            <label className="eqs-label">Mode</label>
            <select
              className="eqs-select"
              value={formData.mode}
              onChange={(e) => handleChange("mode", e.target.value)}
            >
              {MODE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="eqs-form-group">
            <label className="eqs-label">Status</label>
            <select
              className="eqs-select"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="eqs-form-group">
            <label className="eqs-label">Remarks</label>
            <textarea
              className="eqs-textarea"
              rows="5"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              placeholder="Enter remarks..."
            />
          </div>

          <button type="submit" className="eqs-btn" disabled={loading}>
            {loading ? (
              <span className="eqs-btn-loader-wrap">
                <span className="spinner"></span>
                <span>Submitting...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
