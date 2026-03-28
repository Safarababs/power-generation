import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #3b82f6",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 6,
  },
  section: { marginBottom: 12 },
  subtitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  text: { fontSize: 12, marginBottom: 4 },
  list: { marginLeft: 12, marginBottom: 6 },
  listItem: { fontSize: 12, marginBottom: 2 },
  safetyNote: { fontSize: 12, color: "#991b1b", marginBottom: 2 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
});

const SOPPDF = ({ sop }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{sop.title}</Text>
        <Text style={{ fontSize: 10, color: "#6b7280" }}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Objective */}
      {sop.objective && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Objective</Text>
          <Text style={styles.text}>{sop.objective}</Text>
        </View>
      )}

      {/* Steps */}
      {Array.isArray(sop.steps) && sop.steps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Steps</Text>
          {sop.steps.map((step, idx) => (
            <View key={idx} style={styles.list}>
              <Text style={styles.listItem}>
                {idx + 1}. {step.heading}
              </Text>
              {Array.isArray(step.details) &&
                step.details.map((d, dIdx) => (
                  <Text key={dIdx} style={styles.listItem}>
                    {d}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}

      {/* Safety Notes */}
      {Array.isArray(sop.safetyNotes) && sop.safetyNotes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Safety Notes</Text>
          {sop.safetyNotes.map((note, idx) => (
            <Text key={idx} style={styles.safetyNote}>
              ⚠️ {note}
            </Text>
          ))}
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>Confidential SOP Document</Text>
    </Page>
  </Document>
);

export default SOPPDF;
