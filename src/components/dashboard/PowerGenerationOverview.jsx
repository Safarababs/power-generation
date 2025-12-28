import React from 'react';
import { FaBolt, FaBatteryFull } from 'react-icons/fa';
import { IoMdTrendingDown,IoIosTrendingUp } from "react-icons/io";


const PowerGenerationOverview = () => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title">Power Generation Overview</h2>
          <div className="text-sm text-secondary">
            <span>Updated: </span>
            <span>Today, 10:45 AM</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
            <div className="flex items-center mb-2">
              <FaBolt size={20} style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
              <span className="text-secondary font-medium">Current Output</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">457.8</span>
                <span className="text-lg ml-1">MW</span>
              </div>
              <div className="flex items-center text-green">
                <IoIosTrendingUp size={18} />
                <span className="ml-1 text-sm font-medium">+2.4%</span>
              </div>
            </div>
            <div className="mt-2 progress-bar">
              <div className="progress-fill success" style={{ width: '78%' }}></div>
            </div>
            <div className="mt-1 text-xs text-secondary">78% of capacity</div>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
            <div className="flex items-center mb-2">
              <FaBatteryFull size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
              <span className="text-secondary font-medium">Daily Production</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">6,245</span>
                <span className="text-lg ml-1">MWh</span>
              </div>
              <div className="flex items-center text-red">
                <IoMdTrendingDown size={18} />
                <span className="ml-1 text-sm font-medium">-1.2%</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {[65, 70, 85, 60, 75, 50, 80].map((value, index) => (
                <div key={index} className="h-10 rounded-sm overflow-hidden relative" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                  <div 
                    className="absolute bottom-0 w-full rounded-sm" 
                    style={{ 
                      height: `${value}%`,
                      backgroundColor: '#3b82f6'
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-secondary">
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
    </div>
  );
};

export default PowerGenerationOverview;