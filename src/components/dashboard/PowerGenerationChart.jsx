import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const PowerGenerationChart = () => {
  const [activeTab, setActiveTab] = useState('day');
  
  // Simulated hourly data for the day view
  const hourlyData = [250, 245, 260, 285, 310, 340, 375, 410, 430, 450, 465, 460, 
                     455, 445, 460, 470, 465, 440, 420, 390, 350, 320, 290, 265];
  
  // Find max value for scaling
  const maxValue = Math.max(...hourlyData);
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="card-title">Power Generation Trends</h2>
          
          <div className="flex items-center">
            <div className="flex rounded-lg p-1 text-sm mr-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'day' 
                    ? 'btn-primary' 
                    : 'text-secondary'
                }`}
                onClick={() => setActiveTab('day')}
              >
                Day
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'week' 
                    ? 'btn-primary' 
                    : 'text-secondary'
                }`}
                onClick={() => setActiveTab('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeTab === 'month' 
                    ? 'btn-primary' 
                    : 'text-secondary'
                }`}
                onClick={() => setActiveTab('month')}
              >
                Month
              </button>
            </div>
            
            <button className="flex items-center text-sm text-secondary hover:text-primary">
              <FaCalendarAlt size={16} className="mr-1" />
              <span>Oct 23, 2025</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="chart-container">
          {/* Chart Container */}
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="chart-y-axis">
              <div>{Math.round(maxValue)}MW</div>
              <div>{Math.round(maxValue * 0.75)}MW</div>
              <div>{Math.round(maxValue * 0.5)}MW</div>
              <div>{Math.round(maxValue * 0.25)}MW</div>
              <div>0MW</div>
            </div>
            
            {/* Chart Grid */}
            <div className="chart-grid">
              {[0, 1, 2, 3, 4].map((index) => (
                <div 
                  key={index} 
                  className="chart-grid-line" 
                  style={{ top: `${index * 25}%` }}
                ></div>
              ))}
              
              {/* Chart Bars */}
              <div className="chart-bars">
                {hourlyData.map((value, index) => {
                  const height = (value / maxValue) * 100;
                  return (
                    <div 
                      key={index} 
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    >
                      <div className="chart-tooltip">
                        {value} MW
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="chart-x-axis">
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