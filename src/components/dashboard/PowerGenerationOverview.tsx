import React from 'react';
import { TrendingUp, TrendingDown, Zap, Battery } from 'lucide-react';

const PowerGenerationOverview: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Power Generation Overview</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>Updated: </span>
          <span>Today, 10:45 AM</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Zap size={20} className="text-yellow-500 mr-2" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">Current Output</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">457.8</span>
              <span className="text-lg ml-1">MW</span>
            </div>
            <div className="flex items-center text-green-500">
              <TrendingUp size={18} />
              <span className="ml-1 text-sm font-medium">+2.4%</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">78% of capacity</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Battery size={20} className="text-blue-500 mr-2" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">Daily Production</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">6,245</span>
              <span className="text-lg ml-1">MWh</span>
            </div>
            <div className="flex items-center text-red-500">
              <TrendingDown size={18} />
              <span className="ml-1 text-sm font-medium">-1.2%</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {[65, 70, 85, 60, 75, 50, 80].map((value, index) => (
              <div key={index} className="h-10 bg-gray-200 dark:bg-gray-600 rounded-sm overflow-hidden relative">
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 rounded-sm" 
                  style={{ height: `${value}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerGenerationOverview;