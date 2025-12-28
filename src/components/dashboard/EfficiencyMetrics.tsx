import React from 'react';
import { Gauge, BarChart2, Thermometer } from 'lucide-react';

const EfficiencyMetrics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-full transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Efficiency Metrics</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Gauge size={18} className="text-blue-500 mr-2" />
              <span className="text-sm font-medium">Overall Efficiency</span>
            </div>
            <span className="text-lg font-bold">87.4%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '87.4%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BarChart2 size={18} className="text-green-500 mr-2" />
              <span className="text-sm font-medium">Fuel Consumption Rate</span>
            </div>
            <span className="text-lg font-bold">24.5 L/h</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0 L/h</span>
            <span>25 L/h</span>
            <span>50 L/h</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer size={18} className="text-amber-500 mr-2" />
              <span className="text-sm font-medium">Heat Rate</span>
            </div>
            <span className="text-lg font-bold">9,850 BTU/kWh</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>8,000</span>
            <span>10,000</span>
            <span>12,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMetrics;