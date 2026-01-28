import React from "react";
import PowerGenerationOverview from "../components/dashboard/PowerGenerationOverview";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import EfficiencyMetrics from "../components/dashboard/EfficiencyMetrics";
import PowerGenerationChart from "../components/dashboard/PowerGenerationChart";
import GeneratorStatus from "../components/dashboard/GeneratorStatus";
import QuickActions from "../components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PowerGenerationOverview />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <EfficiencyMetrics />
        </div>
        <div className="lg:col-span-2">
          <PowerGenerationChart />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GeneratorStatus />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
