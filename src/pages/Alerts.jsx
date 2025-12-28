import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaClock, FaTimes, FaFilter, FaSearch } from 'react-icons/fa';

const Alerts = () => {
  const { alerts, acknowledgeAlert, clearAlert } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAcknowledged, setShowAcknowledged] = useState(true);

  const AlertIcon = ({ type }) => {
    switch (type) {
      case 'critical':
        return <FaExclamationTriangle size={20} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <FaExclamationTriangle size={20} style={{ color: '#f59e0b' }} />;
      case 'info':
        return <FaInfoCircle size={20} style={{ color: '#3b82f6' }} />;
      case 'success':
        return <FaCheckCircle size={20} style={{ color: '#10b981' }} />;
      default:
        return <FaInfoCircle size={20} style={{ color: '#6b7280' }} />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter;
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (alert.generator && alert.generator.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAcknowledged = showAcknowledged || !alert.acknowledged;
    
    return matchesFilter && matchesSearch && matchesAcknowledged;
  });

  const alertCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    success: alerts.filter(a => a.type === 'success').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary">Show acknowledged:</span>
            <button
              onClick={() => setShowAcknowledged(!showAcknowledged)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showAcknowledged ? 'btn-primary' : ''
              }`}
              style={{ backgroundColor: showAcknowledged ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showAcknowledged ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(alertCounts).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`card p-4 border-2 ${
              filter === type
                ? 'border-blue'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-secondary capitalize">{type}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter size={20} className="text-secondary" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">
              {filter === 'all' ? 'All Alerts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Alerts`}
            </h2>
            <span className="text-sm text-secondary">
              {filteredAlerts.length} of {alerts.length} alerts
            </span>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border-color)' }}>
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-secondary">
              <FaExclamationTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No alerts match your current filters.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-6 flex items-start ${
                  alert.type === 'critical' && !alert.acknowledged ? 'alert-danger' : 
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div className="mr-4 mt-1">
                  <AlertIcon type={alert.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${alert.acknowledged ? 'line-through' : ''}`}>
                        {alert.message}
                      </p>
                      {alert.generator && (
                        <p className="text-sm text-secondary mt-1">
                          Source: {alert.generator}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-secondary">
                        <FaClock size={12} className="mr-1" />
                        <span>{alert.time}</span>
                        {alert.acknowledged && (
                          <span className="ml-4 status-badge status-online">
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="btn btn-primary"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => clearAlert(alert.id)}
                        className="p-1 text-secondary hover:text-red"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredAlerts.length > 0 && (
          <div className="p-4 text-center border-t">
            <button className="text-sm text-blue hover:underline">
              Load more alerts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;