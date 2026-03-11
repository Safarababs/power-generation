import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SummaryPDF from "./SummaryPDF";

const ReportDownload = ({ summary, dateKey }) => (
  <PDFDownloadLink
    document={
      <SummaryPDF summary={summary} dateKey={dateKey} logoPath="/logo.png" />
    }
    fileName={`Engine_Summary_${dateKey}.pdf`}
  >
    {({ loading }) =>
      loading ? (
        <button className="btn btn-primary">Preparing PDF...</button>
      ) : (
        <button className="btn btn-primary">Download PDF</button>
      )
    }
  </PDFDownloadLink>
);

export default ReportDownload;
