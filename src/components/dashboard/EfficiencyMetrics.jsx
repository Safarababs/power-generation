import React from 'react';
import { FaTachometerAlt, FaChartBar, FaThermometerHalf } from 'react-icons/fa';

const EfficiencyMetrics = () => {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h2 className="card-title">Efficiency Metrics</h2>
      </div>
      
      <div className="card-content space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaTachometerAlt size={18} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
              <span className="text-sm font-medium">Overall Efficiency</span>
            </div>
            <span className="text-lg font-bold">87.4%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '87.4%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-secondary">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaChartBar size={18} style={{ color: '#10b981', marginRight: '0.5rem' }} />
              <span className="text-sm font-medium">Fuel Consumption Rate</span>
            </div>
            <span className="text-lg font-bold">24.5 L/h</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill success" style={{ width: '65%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-secondary">
            <span>0 L/h</span>
            <span>25 L/h</span>
            <span>50 L/h</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaThermometerHalf size={18} style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
              <span className="text-sm font-medium">Heat Rate</span>
            </div>
            <span className="text-lg font-bold">9,850 BTU/kWh</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill warning" style={{ width: '45%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-secondary">
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