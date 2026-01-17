import React, { use, useEffect, useState } from "react";
import { FaBolt, FaBatteryFull } from "react-icons/fa";
import { IoMdTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../FIrestore/firebase";

const ImportReadings = () => {
  // LastDoc and secondLastDoc there are KWH State to hold the last two documents from Firestore collection
  const [lastDoc, setLastDoc] = useState(null);
  const [secondLastDoc, setSecondLastDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "engineReadings"),
        orderBy("timestamp", "desc"),
        limit(2) // 🔹 only fetch last 2 docs
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          operator: docData.operator,
          readings:
            docData.readings?.map((r) => ({
              kwh: Number(r.kwh),
              rhrs: Number(r.rhrs),
              timestamp: r.timestamp || null,
            })) || [],
          timestamp: docData.timestamp || null,
        };
      });

      // 🔹 docs[0] = latest, docs[1] = second latest
      if (docs.length > 0) {
        setLastDoc(docs[0]);
        if (docs.length > 1) {
          setSecondLastDoc(docs[1]);
        }
      }
    };
    fetchData();
  }, []);

  // we can calculate total generation and rhrs by using lasDoc and secondKLastDoc but we need individual engines generation and rhrs for that we will use useState hooks
  const [GensetOneGeneration, setGensetOneGeneration] = useState(0);
  const [GensetTwoGeneration, setGensetTwoGeneration] = useState(0);
  const [GensetThreeGeneration, setGensetThreeGeneration] = useState(0);
  const [GensetFourGeneration, setGensetFourGeneration] = useState(0);
  const [GensetFiveGeneration, setGensetFiveGeneration] = useState(0);
  const [GensetOneRhrs, setGensetOneRhrs] = useState(0);
  const [GensetTwoRhrs, setGensetTwoRhrs] = useState(0);
  const [GensetThreeRhrs, setGensetThreeRhrs] = useState(0);
  const [GensetFourRhrs, setGensetFourRhrs] = useState(0);
  const [GensetFiveRhrs, setGensetFiveRhrs] = useState(0);

  useEffect(() => {
    if (lastDoc) {
      setGensetOneGeneration(
        lastDoc.readings[0]?.kwh - secondLastDoc.readings[0]?.kwh || 0
      );
      setGensetTwoGeneration(
        lastDoc.readings[1]?.kwh - secondLastDoc.readings[1]?.kwh || 0
      );
      setGensetThreeGeneration(
        lastDoc.readings[2]?.kwh - secondLastDoc.readings[2]?.kwh || 0
      );
      setGensetFourGeneration(
        lastDoc.readings[3]?.kwh - secondLastDoc.readings[3]?.kwh || 0
      );
      setGensetFiveGeneration(
        lastDoc.readings[4]?.kwh - secondLastDoc.readings[4]?.kwh || 0
      );
    }
  }, [lastDoc]);
  useEffect(() => {
    if (lastDoc) {
      setGensetOneRhrs(
        lastDoc.readings[0]?.rhrs || 0 - secondLastDoc.readings[0]?.rhrs || 0
      );
      setGensetTwoRhrs(
        lastDoc.readings[1]?.rhrs || 0 - secondLastDoc.readings[1]?.rhrs || 0
      );
      setGensetThreeRhrs(
        lastDoc.readings[2]?.rhrs || 0 - secondLastDoc.readings[2]?.rhrs || 0
      );
      setGensetFourRhrs(
        lastDoc.readings[3]?.rhrs || 0 - secondLastDoc.readings[3]?.rhrs || 0
      );
      setGensetFiveRhrs(
        lastDoc.readings[4]?.rhrs || 0 - secondLastDoc.readings[4]?.rhrs || 0
      );
    }
  }, [lastDoc]);

  console.log("GensetOneGeneration:", GensetOneGeneration);
  console.log("GensetOneRhrs:", GensetOneRhrs);

  const totalGeneration =
    GensetOneGeneration +
    GensetTwoGeneration +
    GensetThreeGeneration +
    GensetFourGeneration +
    GensetFiveGeneration;
  const totalRhrs =
    GensetOneRhrs +
    GensetTwoRhrs +
    GensetThreeRhrs +
    GensetFourRhrs +
    GensetFiveRhrs;

  // currently we assuming total capacity is 9500 KW
  const totalCapacity = 9500;

  const averageOutputMW = totalRhrs
    ? (totalGeneration / totalRhrs).toFixed(2)
    : 0;
  const averageOutputPercentage = (averageOutputMW / totalCapacity) * 100;

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title">Power Generation Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lastDoc?.readings.map((engine, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-100">
              <h3 className="text-lg font-semibold mb-2">Engine {index + 1}</h3>
              <p>KWh: {engine.kwh}</p>
              <p>Rhrs: {engine.rhrs}</p>
              <p>Yesterday KWh: {secondLastDoc?.readings[index]?.kwh || 0}</p>
              <p>Yesterday Rhrs: {secondLastDoc?.readings[index]?.rhrs || 0}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Output */}
          <div className="p-4 rounded-lg bg-gray-100">
            <div className="flex items-center mb-2">
              <FaBolt
                size={20}
                style={{ color: "#f59e0b", marginRight: "0.5rem" }}
              />
              <span className="text-secondary font-medium">Average Output</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">
                  {averageOutputPercentage.toFixed(2)}
                </span>
                <span className="text-lg ml-1">%</span>
              </div>
              <div className="flex items-center text-green">
                <IoIosTrendingUp size={18} />
                <span className="ml-1 text-sm font-medium">+2.4%</span>
              </div>
            </div>
          </div>

          {/* Daily Production */}
          <div className="p-4 rounded-lg bg-gray-100">
            <div className="flex items-center mb-2">
              <FaBatteryFull
                size={20}
                style={{ color: "#3b82f6", marginRight: "0.5rem" }}
              />
              <span className="text-secondary font-medium">
                Daily Production
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">{totalGeneration}</span>
                <span className="text-lg ml-1">KWh</span>
              </div>
              <div className="flex items-center text-red">
                <IoMdTrendingDown size={18} />
                <span className="ml-1 text-sm font-medium">
                  {totalGeneration}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-secondary">
              Yesterday:{" "}
              {secondLastDoc?.readings.reduce((sum, r) => sum + r.kwh, 0) || 0}{" "}
              KWh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportReadings;
