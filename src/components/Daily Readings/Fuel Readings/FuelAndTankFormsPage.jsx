import React from "react";
import DailyFuelEntryForm from "./Dip and Recieving/DailyFuelEntryForm";
import DailyTankSoundingForm from "./Dip and Recieving/DailyTankSoundingForm";

const FuelAndTankFormsPage = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="grid grid-cols-1 gap-6">
          <DailyFuelEntryForm />
          <DailyTankSoundingForm />
        </div>
      </div>
    </div>
  );
};

export default FuelAndTankFormsPage;
