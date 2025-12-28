import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const PowerGenerationChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  
  // Simulated hourly data for the day view
  const hourlyData = [250, 245, 260, 285, 310, 340, 375, 410, 430, 450, 465, 460, 
                     455, 445, 460, 470, 465, 440, 420, 390, 350, 320, 290, 265];
  
  // Find max value for scaling
  const maxValue = Math.max(...hourlyData);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold">Power Generation Trends</h2>
          
          <div className="flex items-center">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 text-sm mr-2">
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'day' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('day')}
              >
                Day
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'week' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'month' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('month')}
              >
                Month
              </button>
            </div>
            
            <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <Calendar size={16} className="mr-1" />
              <span>Oct 23, 2025</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-64">
          {/* Chart Container */}
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>{Math.round(maxValue)}MW</div>
              <div>{Math.round(maxValue * 0.75)}MW</div>
              <div>{Math.round(maxValue * 0.5)}MW</div>
              <div>{Math.round(maxValue * 0.25)}MW</div>
              <div>0MW</div>
            </div>
            
            {/* Chart Grid */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              {[0, 1, 2, 3, 4].map((index) => (
                <div 
                  key={index} 
                  className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-700" 
                  style={{ top: `${index * 25}%` }}
                ></div>
              ))}
              
              {/* Chart Bars */}
              <div className="absolute left-0 right-0 bottom-0 top-0 flex items-end">
                {hourlyData.map((value, index) => {
                  const height = (value / maxValue) * 100;
                  return (
                    <div 
                      key={index} 
                      className="flex-1 mx-0.5 group"
                    >
                      <div 
                        className="relative bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                          {value} MW
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 pl-12">
            <div>12 AM</div>
            <div>6 AM</div>
            <div>12 PM</div>
            <div>6 PM</div>
            <div>12 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerGenerationChart;