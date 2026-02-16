import React from "react";

export default function ProtectionsSafety() {
  const protections = [
    {
      title: "Over Frequency",
      definition_en:
        "Occurs when engine speed exceeds nominal frequency (50/60 Hz).",
      definition_ur: "جب انجن کی رفتار معمول کی فریکوئنسی سے زیادہ ہو جائے۔",
      explanation:
        "Over frequency can damage connected equipment and cause instability in the grid.",
      alarm_value: "52 Hz",
      trip_value: "53 Hz",
    },
    {
      title: "Under Frequency",
      definition_en: "Occurs when engine speed drops below nominal frequency.",
      definition_ur: "جب انجن کی رفتار معمول کی فریکوئنسی سے کم ہو جائے۔",
      explanation:
        "Under frequency indicates overload or fuel issues and can destabilize the grid.",
      alarm_value: "48 Hz",
      trip_value: "47 Hz",
    },
    {
      title: "Over Voltage",
      definition_en: "Voltage rises above safe operating limits.",
      definition_ur: "جب وولٹیج محفوظ حد سے زیادہ ہو جائے۔",
      explanation:
        "Over voltage can damage insulation and connected equipment.",
      alarm_value: "440 V",
      trip_value: "450 V",
    },
    {
      title: "Under Voltage",
      definition_en: "Voltage drops below safe operating limits.",
      definition_ur: "جب وولٹیج محفوظ حد سے کم ہو جائے۔",
      explanation:
        "Under voltage can cause malfunction of auxiliaries and unstable operation.",
      alarm_value: "380 V",
      trip_value: "370 V",
    },
    {
      title: "Over Speed",
      definition_en: "Engine speed exceeds design limit.",
      definition_ur: "جب انجن کی رفتار ڈیزائن کی حد سے زیادہ ہو جائے۔",
      explanation:
        "Over speed can cause mechanical damage and unsafe operation.",
      alarm_value: "105% of rated speed",
      trip_value: "110% of rated speed",
    },
    {
      title: "Low Lube Oil Pressure",
      definition_en: "Lubrication oil pressure falls below safe limit.",
      definition_ur: "جب لبریکیٹنگ آئل کا پریشر محفوظ حد سے کم ہو جائے۔",
      explanation:
        "Low oil pressure can cause bearing damage and engine seizure.",
      alarm_value: "2.0 bar",
      trip_value: "1.5 bar",
    },
    {
      title: "High Lube Oil Temperature",
      definition_en: "Lubrication oil temperature rises above safe limit.",
      definition_ur:
        "جب لبریکیٹنگ آئل کا درجہ حرارت محفوظ حد سے زیادہ ہو جائے۔",
      explanation: "High oil temperature reduces viscosity and causes wear.",
      alarm_value: "95 °C",
      trip_value: "100 °C",
    },
    {
      title: "High Cooling Water Temperature",
      definition_en: "Cooling water temperature exceeds safe limit.",
      definition_ur: "جب کولنگ واٹر کا درجہ حرارت محفوظ حد سے زیادہ ہو جائے۔",
      explanation: "High temperature can cause overheating and engine damage.",
      alarm_value: "90 °C",
      trip_value: "95 °C",
    },
    {
      title: "Low Fuel Pressure",
      definition_en: "Fuel supply pressure drops below required level.",
      definition_ur: "جب فیول سپلائی پریشر مطلوبہ سطح سے کم ہو جائے۔",
      explanation:
        "Low fuel pressure can cause misfiring and unstable operation.",
      alarm_value: "4 bar",
      trip_value: "3 bar",
    },
    {
      title: "High Exhaust Temperature",
      definition_en: "Exhaust gas temperature rises above safe limit.",
      definition_ur: "جب ایگزاسٹ گیس کا درجہ حرارت محفوظ حد سے زیادہ ہو جائے۔",
      explanation:
        "High exhaust temperature indicates poor combustion or overload.",
      alarm_value: "500 °C",
      trip_value: "550 °C",
    },
  ];

  return (
    <div className="container space-y-6">
      <h2
        className="text-line-height"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Protections & Safety – Wärtsilä 34DF
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {protections.map((item, index) => (
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
            <p
              className="font-urdu"
              style={{ fontSize: "0.95rem", marginBottom: "0.3rem" }}
            >
              <strong>تعریف=></strong> {item.definition_ur}
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
                    Trip Value
                  </th>
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
                    {item.trip_value}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
