import React from "react";
import { formatNumber } from "../../../Daily Readings/Monthly DGR/monthlyJsonReportService";

export default function ExecutiveKpiCards({ cards }) {
  return (
    <div className="card-content">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            className="card"
            key={card.label}
            style={{
              borderLeft: `5px solid ${card.color || "var(--primary-color)"}`,
            }}
          >
            <div className="card-content">
              <p className="text-sm text-secondary">{card.label}</p>
              <h3
                className="text-2xl font-bold mt-2"
                style={{ color: card.color }}
              >
                {formatNumber(card.value)}
              </h3>
              {card.note ? (
                <p className="text-sm text-secondary mt-1">{card.note}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
