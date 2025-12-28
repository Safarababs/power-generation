import React from 'react';
import { AlertTriangle, Info, CheckCircle, Clock, X } from 'lucide-react';

type AlertType = 'critical' | 'warning' | 'info' | 'success';

interface Alert {
  id: number;
  type: AlertType;
  message: string;
  time: string;
}

const AlertIcon: React.FC<{ type: AlertType }> = ({ type }) => {
  switch (type) {
    case 'critical':
      return <AlertTriangle size={16} className="text-red-500" />;
    case 'warning':
      return <AlertTriangle size={16} className="text-amber-500" />;
    case 'info':
      return <Info size={16} className="text-blue-500" />;
    case 'success':
      return <CheckCircle size={16} className="text-green-500" />;
  }
};

const AlertsPanel: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: 1,
      type: 'critical',
      message: 'Generator #3 temperature exceeding threshold',
      time: '5m ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Substation voltage fluctuation detected',
      time: '15m ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'Scheduled maintenance for Turbine #5',
      time: '1h ago'
    },
    {
      id: 4,
      type: 'success',
      message: 'Grid synchronization completed successfully',
      time: '2h ago'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-full transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
          <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">
            1 Critical
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 flex items-start ${
              alert.type === 'critical' ? 'bg-red-50 dark:bg-red-900/10' : ''
            }`}
          >
            <div className="mr-3 mt-0.5">
              <AlertIcon type={alert.type} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} className="mr-1" />
                <span>{alert.time}</span>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default AlertsPanel;