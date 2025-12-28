// PixelCard.jsx
import React from "react";

const PixelCard = ({ model, quantity, specs, variants, price }) => (
  <div
    style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
    }}
  >
    <h2>{model}</h2>
    <p>
      <strong>Quantity:</strong> {quantity}
    </p>
    {specs && (
      <p>
        <strong>Specs:</strong> {specs.join(", ")}
      </p>
    )}
    {variants ? (
      <ul>
        {variants.map((variant, index) => (
          <li key={index}>
            💾 {variant.ram && `${variant.ram}`} / {variant.rom} • Rs.{" "}
            {variant.price}
            {variant.condition && ` • Condition: ${variant.condition}`}
          </li>
        ))}
      </ul>
    ) : (
      <p>
        <strong>Price:</strong> Rs. {price}
      </p>
    )}
  </div>
);

export default PixelCard;
