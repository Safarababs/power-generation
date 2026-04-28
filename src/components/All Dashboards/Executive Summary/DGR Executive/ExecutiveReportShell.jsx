import React from "react";

export default function ExecutiveReportShell({
  title,
  subtitle,
  reportTitle,
  children,
}) {
  return (
    <div className="card fade-in">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {reportTitle ? (
          <p className="text-base font-semibold text-blue mt-1">
            {reportTitle}
          </p>
        ) : null}
        {subtitle ? (
          <p className="text-sm text-secondary mt-1">{subtitle}</p>
        ) : null}
      </div>

      <div className="card-content">{children}</div>
    </div>
  );
}
