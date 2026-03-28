import { useState } from "react";
import protections from "./protections";

export default function ProtectionsSafety() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSops = protections.filter((safety) =>
    safety.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="container space-y-6">
      <h2
        className="text-line-height"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Protections & Safety – Wärtsilä 34DF
      </h2>
      <div className="card-header">
        <input
          type="text"
          placeholder="Search Protection..."
          className="border p-2 rounded w-full mt-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSops.map((item, index) => (
          <div
            key={index}
            className="protection-card"
            style={{
              backgroundColor: "var(--surface-color)",
              color: "var(--text-primary)",
              border: `1px solid var(--border-color)`,
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--shadow-md)",
              padding: "1rem",
              transition: "var(--transition)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {item.title}
            </h3>
            <p style={{ fontSize: "0.95rem", marginBottom: "0.3rem" }}>
              <strong>Definition (EN):</strong> {item.definition_en}
            </p>
            {/* urdu is not desplaying for the time being */}
            <p
              className="font-urdu"
              style={{ fontSize: "0.95rem", marginBottom: "0.3rem" }}
            >
              <strong>تعریف={">"}</strong> {item.definition_ur}
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              <strong>Explanation:</strong> {item.explanation}
            </p>

            {item.alarm_value ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "var(--background-color)" }}>
                    <th
                      style={{
                        border: `1px solid var(--border-color)`,
                        padding: "6px",
                        textAlign: "center",
                        color: "var(--warning-color)",
                      }}
                    >
                      Alarm Value
                    </th>
                    <th
                      style={{
                        border: `1px solid var(--border-color)`,
                        padding: "6px",
                        textAlign: "center",
                        color: "var(--error-color)",
                      }}
                    >
                      {item.isShutdown ? "Shutdown Value" : "Trip Value"}
                    </th>
                    {item.trip_stages && item.trip_stages.length > 1 && (
                      <th
                        style={{
                          border: `1px solid var(--border-color)`,
                          padding: "6px",
                          textAlign: "center",
                          color: "var(--error-color)",
                        }}
                      >
                        {item.isShutdown
                          ? "ShutDown (Second Stage)"
                          : "Trip Value (Second Value)"}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: `1px solid var(--border-color)`,
                        padding: "6px",
                        textAlign: "center",
                      }}
                    >
                      {item.alarm_value}
                    </td>
                    <td
                      style={{
                        border: `1px solid var(--border-color)`,
                        padding: "6px",
                        textAlign: "center",
                      }}
                    >
                      {item.trip_stages && item.trip_stages.length > 0 ? (
                        <div>
                          {/* <strong>{item.trip_stages[0].stage}:</strong>{" "} */}
                          {item.trip_stages[0].value}
                        </div>
                      ) : (
                        item.trip_value || item.SHD_Value
                      )}
                    </td>
                    {item.trip_stages && item.trip_stages.length > 1 && (
                      <td
                        style={{
                          border: `1px solid var(--border-color)`,
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        {/* <strong>{item.trip_stages[1].stage}:</strong>{" "} */}
                        {item.trip_stages[1].value}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
