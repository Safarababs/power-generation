import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const PowerGenerationOverviewtest = () => {
  const [todayReadings, setTodayReadings] = useState([]);

  useEffect(() => {
    const fetchReadings = async () => {
      const readingsQuery = query(
        collection(db, "engineReadings"),
        orderBy("date", "desc"),
      );

      const snapshot = await getDocs(readingsQuery);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTodayReadings(data);
    };

    fetchReadings();
  }, []);

  // ✅ Guard against empty array
  if (todayReadings.length === 0) {
    return <div>Loading...</div>;
  }

  const latest = todayReadings[0]; // most recent reading

  // build array with individual capacities
  const todayGeneration = latest.generation.map((gen, index) => ({
    engine: `Engine ${index + 1}`,
    rhrs: gen.rhrs,
    kwh: gen.kwh,
    capacity: gen.rhrs * 9700, // ✅ individual capacity
  }));

  // compute total capacity across all engines
  const totalCapacity = todayGeneration.reduce((sum, e) => sum + e.capacity, 0);
  // compute total kWh across all engines
  const totalKwh = todayGeneration.reduce((sum, e) => sum + e.kwh, 0);
  // compute total generation accross all engines
  const totalGeneration = todayGeneration.reduce((sum, e) => sum + e.kwh, 0);

  const averageKwh = (totalKwh / totalCapacity) * (100).toFixed(2) || 0; // ✅ average kWh per capacity unit
  console.log("Total Capacity:", totalCapacity);
  console.log("Total kWh:", totalKwh);
  console.log("Average kWh per Capacity Unit:", averageKwh);
  console.log("Today's Generation:", totalGeneration);

  return (
    <div>
      <h3>Today’s Generation</h3>
      <pre>{JSON.stringify(todayGeneration, null, 2)}</pre>
      <h3>{averageKwh.toFixed(2)}%</h3>
    </div>
  );
};

export default PowerGenerationOverviewtest;
