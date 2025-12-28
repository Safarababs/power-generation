import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FaChartLine, FaThermometerHalf, FaTachometerAlt, FaBolt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Monitoring = () => {
  const { generators } = useData();
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generators.map(gen => ({
        id: gen.id,
        name: gen.name,
        timestamp: new Date().toLocaleTimeString(),
        output: gen.output,
        temperature: gen.temperature,
        vibration: Math.random() * 10 + 5,
        pressure: Math.random() * 50 + 100,
        voltage: Math.random() * 20 + 220,
        frequency: Math.random() * 2 + 49
      }));
      setRealTimeData(prev => [...newData, ...prev.slice(0, 50)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [generators]);

  const getHealthStatus = (generator) => {
    if (generator.status === 'offline') return { status: 'offline', color: '#6b7280', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6b7280' }} /> };
    if (generator.temperature > 90) return { status: 'critical', color: '#ef4444', icon: <FaExclamationTriangle size={12} style={{ color: '#ef4444' }} /> };
    if (generator.temperature > 85) return { status: 'warning', color: '#f59e0b', icon: <FaExclamationTriangle size={12} style={{ color: '#f59e0b' }} /> };
    return { status: 'healthy', color: '#10b981', icon: <FaCheckCircle size={12} style={{ color: '#10b981' }} /> };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Real-Time Monitoring</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full pulse" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-sm text-secondary">Live Data</span>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">System Load</p>
                <p className="text-2xl font-bold">{generators.reduce((sum, g) => sum + g.output, 0).toFixed(1)} MW</p>
              </div>
              <FaBolt size={32} style={{ color: '#f59e0b' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Avg Temperature</p>
                <p className="text-2xl font-bold">{(generators.reduce((sum, g) => sum + g.temperature, 0) / generators.length).toFixed(1)}°C</p>
              </div>
              <FaThermometerHalf size={32} style={{ color: '#ef4444' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">System Efficiency</p>
                <p className="text-2xl font-bold">{((generators.reduce((sum, g) => sum + g.output, 0) / generators.reduce((sum, g) => sum + g.capacity, 0)) * 100).toFixed(1)}%</p>
              </div>
              <FaTachometerAlt size={32} style={{ color: '#3b82f6' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Active Units</p>
                <p className="text-2xl font-bold">{generators.filter(g => g.status === 'online').length}/{generators.length}</p>
              </div>
              <FaChartLine size={32} style={{ color: '#10b981' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Generator Health Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generator Health Status</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generators.map((generator) => {
              const health = getHealthStatus(generator);
              return (
                <div key={generator.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{generator.name}</h3>
                    <div className="flex items-center space-x-2">
                      {health.icon}
                      <span className="text-sm font-medium" style={{ color: health.color }}>
                        {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Output</span>
                        <span className="text-sm font-medium">{generator.output} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Temperature</span>
                        <span className={`text-sm font-medium`} style={{ 
                          color: generator.temperature > 90 ? '#ef4444' : generator.temperature > 85 ? '#f59e0b' : '#10b981'
                        }}>
                          {generator.temperature}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Efficiency</span>
                        <span className="text-sm font-medium">{generator.efficiency}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Vibration</span>
                        <span className="text-sm font-medium">{(Math.random() * 10 + 5).toFixed(1)} mm/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Pressure</span>
                        <span className="text-sm font-medium">{(Math.random() * 50 + 100).toFixed(0)} PSI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary">Voltage</span>
                        <span className="text-sm font-medium">{(Math.random() * 20 + 220).toFixed(1)}V</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Load Factor</span>
                      <span>{((generator.output / generator.capacity) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${
                          generator.output / generator.capacity > 0.9 ? 'danger' :
                          generator.output / generator.capacity > 0.7 ? 'warning' : 'success'
                        }`}
                        style={{ width: `${(generator.output / generator.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Data Stream */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Live Data Stream</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Generator</th>
                  <th>Output (MW)</th>
                  <th>Temp (°C)</th>
                  <th>Vibration</th>
                  <th>Pressure</th>
                  <th>Voltage</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {realTimeData.slice(0, 10).map((data, index) => (
                  <tr key={index}>
                    <td>{data.timestamp}</td>
                    <td className="font-medium">{data.name}</td>
                    <td>{data.output?.toFixed(1) || '0.0'}</td>
                    <td style={{ 
                      color: data.temperature > 90 ? '#ef4444' : data.temperature > 85 ? '#f59e0b' : '#10b981'
                    }}>
                      {data.temperature || 25}
                    </td>
                    <td>{data.vibration?.toFixed(1)} mm/s</td>
                    <td>{data.pressure?.toFixed(0)} PSI</td>
                    <td>{data.voltage?.toFixed(1)}V</td>
                    <td>{data.frequency?.toFixed(2)} Hz</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;