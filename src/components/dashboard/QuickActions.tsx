import React from 'react';
import { ShieldCheck, Power, RefreshCw, AlertOctagon, FileText, Clock } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: <ShieldCheck size={20} className="text-green-500" />,
      label: 'System Check',
      description: 'Run diagnostics'
    },
    {
      icon: <Power size={20} className="text-red-500" />,
      label: 'Emergency Stop',
      description: 'All generators'
    },
    {
      icon: <RefreshCw size={20} className="text-blue-500" />,
      label: 'Load Balance',
      description: 'Optimize output'
    },
    {
      icon: <AlertOctagon size={20} className="text-amber-500" />,
      label: 'Reset Alerts',
      description: 'Clear notifications'
    },
    {
      icon: <FileText size={20} className="text-purple-500" />,
      label: 'Generate Report',
      description: 'Daily summary'
    },
    {
      icon: <Clock size={20} className="text-indigo-500" />,
      label: 'Schedule Task',
      description: 'Plan maintenance'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-full transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button 
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
            >
              <div className="mb-2">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;