import React from 'react';
import { Circle, RotateCw, AlertTriangle, Pause, Play } from 'lucide-react';

interface Generator {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  output: number;
  capacity: number;
  uptime: string;
  nextMaintenance: string;
}

const GeneratorStatus: React.FC = () => {
  const generators: Generator[] = [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-500';
      case 'maintenance':
        return 'text-blue-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle size={14} className="fill-green-500 text-green-500" />;
      case 'offline':
        return <Circle size={14} className="text-gray-500" />;
      case 'maintenance':
        return <RotateCw size={14} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-amber-500" />;
      default:
        return <Circle size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generator Status</h2>
          <button className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            Manage
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Output</th>
              <th className="px-6 py-3">Uptime</th>
              <th className="px-6 py-3">Next Maintenance</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {generators.map((generator) => (
              <tr key={generator.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getStatusIcon(generator.status)}
                    <span className={`ml-2 text-sm ${getStatusColor(generator.status)}`}>
                      {generator.status.charAt(0).toUpperCase() + generator.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {generator.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col">
                    <span>{generator.output} MW</span>
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(generator.output / generator.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {generator.uptime}
                </td>
                <td className="px-6 py-4 text-sm">
                  {generator.nextMaintenance}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    {generator.status === 'online' ? (
                      <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Pause size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    ) : (
                      <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Play size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                    <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                      <RotateCw size={16} className="text-gray-500 dark:text-gray-400" />
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