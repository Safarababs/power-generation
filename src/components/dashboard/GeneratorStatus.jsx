import React from 'react';
import { FaCircle, FaSync, FaExclamationTriangle, FaPause, FaPlay } from 'react-icons/fa';

const GeneratorStatus = () => {
  const generators = [
    {
      id: 1,
      name: 'Generator 1',
      status: 'online',
      output: 120.5,
      capacity: 150,
      uptime: '24d 13h',
      nextMaintenance: '7d'
    },
    {
      id: 2,
      name: 'Generator 2',
      status: 'online',
      output: 145.2,
      capacity: 150,
      uptime: '12d 6h',
      nextMaintenance: '18d'
    },
    {
      id: 3,
      name: 'Generator 3',
      status: 'warning',
      output: 98.7,
      capacity: 150,
      uptime: '3d 4h',
      nextMaintenance: '4d'
    },
    {
      id: 4,
      name: 'Generator 4',
      status: 'maintenance',
      output: 0,
      capacity: 150,
      uptime: '0d 0h',
      nextMaintenance: '1d'
    },
    {
      id: 5,
      name: 'Generator 5',
      status: 'offline',
      output: 0,
      capacity: 150,
      uptime: '0d 0h',
      nextMaintenance: '30d'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'offline':
        return '#6b7280';
      case 'maintenance':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <FaCircle size={14} style={{ color: '#10b981' }} />;
      case 'offline':
        return <FaCircle size={14} style={{ color: '#6b7280' }} />;
      case 'maintenance':
        return <FaSync size={14} style={{ color: '#3b82f6' }} />;
      case 'warning':
        return <FaExclamationTriangle size={14} style={{ color: '#f59e0b' }} />;
      default:
        return <FaCircle size={14} style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Generator Status</h2>
          <button className="btn btn-primary">
            Manage
          </button>
        </div>
      </div>
      
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
            {generators.map((generator) => (
              <tr key={generator.id}>
                <td>
                  <div className="flex items-center">
                    {getStatusIcon(generator.status)}
                    <span className="ml-2 text-sm" style={{ color: getStatusColor(generator.status) }}>
                      {generator.status.charAt(0).toUpperCase() + generator.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="font-medium">
                  {generator.name}
                </td>
                <td>
                  <div className="flex flex-col">
                    <span>{generator.output} MW</span>
                    <div className="w-24 progress-bar mt-1">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(generator.output / generator.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  {generator.uptime}
                </td>
                <td>
                  {generator.nextMaintenance}
                </td>
                <td>
                  <div className="flex space-x-2">
                    {generator.status === 'online' ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneratorStatus;