import React from "react";
import RealTimeStatus from "../../Daily Readings/Egnien Start  Stop/RealTimeStatus";
import EfficiencyMetrics from "../../dashboard/EfficiencyMetrics";
import Generation from "../../../pages/Generation";
import PowerGenerationChart from "../../dashboard/PowerGenerationChart";
import ImportReadings from "../../dashboard/PowerGenerationOverview";

const OperationDashboard = () => {
  return (
    <>
      <RealTimeStatus />
      <ImportReadings />
      <PowerGenerationChart />

      <EfficiencyMetrics />
    </>
  );
};

export default OperationDashboard;
