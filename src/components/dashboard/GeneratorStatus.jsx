import React from "react";
import {
  FaCircle,
  FaSync,
  FaExclamationTriangle,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../FIrestore/firebase";

const GeneratorStatus = () => {
  const [generatorStatus, setGeneratorsStatus] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [generatorsOutput, setGeneratorsOutput] = React.useState({});
  const GENERATOR_CAPACITY = 9700; // kW

  const getGeneratorMetrics = (index) => {
    if (!generatorsOutput?.generation?.[index]) {
      return { avgOutput: 0, efficiency: 0 };
    }

    const { kwh, rhrs } = generatorsOutput.generation[index];

    if (!rhrs || rhrs === 0) {
      return { avgOutput: 0, efficiency: 0 };
    }

    const avgOutput = kwh / rhrs;

    let efficiency = (avgOutput / GENERATOR_CAPACITY) * 100;

    // Clamp between 0–100
    efficiency = Math.min(Math.max(efficiency, 0), 100);

    return {
      avgOutput: avgOutput.toFixed(1),
      efficiency: efficiency.toFixed(1),
    };
  };

  React.useEffect(() => {
    const q = query(
      collection(db, "engineReadings"),
      orderBy("date", "desc"),
      limit(1),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // setGeneratorsOutput(detched data)
      if (!snapshot.empty) {
        const latestData = snapshot.docs[0].data();
        setGeneratorsOutput(latestData);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch engineStatus collection
  React.useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "engineStatus"),
      orderBy("updatedAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map((doc) => doc.data());

      // Sort by engineId (E1, E2, E3…)
      docs.sort((a, b) => {
        const numA = parseInt(a.engineId.replace("E", ""), 10);
        const numB = parseInt(b.engineId.replace("E", ""), 10);
        return numA - numB;
      });

      setGeneratorsStatus(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Calculate uptime (days, hours, minutes, seconds)
  const calculateUptime = (engine) => {
    if (!engine.lastEventTime) return "0d 0h 0m 0s";

    const lastEvent = new Date(engine.lastEventTime.seconds * 1000);

    if (
      engine.currentStatus === "running" ||
      engine.currentStatus === "stopped"
    ) {
      const diffMs = Date.now() - lastEvent.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      const days = Math.floor(diffSeconds / (60 * 60 * 24));
      const hours = Math.floor((diffSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diffSeconds % 60) / 60);
      const seconds = diffSeconds % 60;

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return "0d 0h 0m 0s";
  };

  // Update uptime live every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setGeneratorsStatus((prev) =>
        prev.map((engine) => ({
          ...engine,
          uptime: calculateUptime(engine),
        })),
      );
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "#10b981";
      case "stopped":
        return "red";
      case "maintenance":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <FaCircle size={14} style={{ color: "#10b981" }} />;
      case "stopped":
        return <FaCircle size={14} style={{ color: "red" }} />;
      case "maintenance":
        return <FaSync size={14} style={{ color: "#3b82f6" }} />;
      case "warning":
        return <FaExclamationTriangle size={14} style={{ color: "#f59e0b" }} />;
      default:
        return <FaCircle size={14} style={{ color: "#6b7280" }} />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Generator Status</h2>
          <button className="btn btn-primary">Manage</button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-secondary">Loading data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Output</th>
                <th>Uptime</th>
                <th>Next Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generatorStatus.map((generator, index) => {
                const { avgOutput, efficiency } = getGeneratorMetrics(index);

                return (
                  <tr key={generator.engineId}>
                    <td>
                      <div className="flex items-center">
                        {getStatusIcon(generator.currentStatus)}
                        <span
                          className="ml-2 text-sm"
                          style={{
                            color: getStatusColor(generator.currentStatus),
                          }}
                        >
                          {generator.currentStatus.charAt(0).toUpperCase() +
                            generator.currentStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="font-medium">{generator.engineId}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>
                          {avgOutput} kW ({efficiency}%)
                        </span>

                        <div className="w-24 progress-bar mt-1 relative">
                          <div
                            className="progress-fill flex items-center justify-center text-xs text-white font-semibold transition-all duration-500"
                            style={{
                              width: `${efficiency}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{generator.uptime || calculateUptime(generator)}</td>
                    <td>{generator.nextMaintenance || "N/A"}</td>
                    <td>
                      <div className="flex space-x-2">
                        {generator.currentStatus === "running" ? (
                          <button className="p-1 rounded-md hover:bg-gray-200">
                            <FaPause size={16} className="text-secondary" />
                          </button>
                        ) : (
                          <button className="p-1 rounded-md hover:bg-gray-200">
                            <FaPlay size={16} className="text-secondary" />
                          </button>
                        )}
                        <button className="p-1 rounded-md hover:bg-gray-200">
                          <FaSync size={16} className="text-secondary" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeneratorStatus;
