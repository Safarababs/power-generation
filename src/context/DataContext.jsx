import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [generators, setGenerators] = useState([
    {
      id: 1,
      name: 'Generator 1',
      status: 'online',
      output: 120.5,
      capacity: 150,
      uptime: '24d 13h',
      nextMaintenance: '7d',
      temperature: 85,
      fuelConsumption: 24.5,
      efficiency: 87.4
    },
    {
      id: 2,
      name: 'Generator 2',
      status: 'online',
      output: 145.2,
      capacity: 150,
      uptime: '12d 6h',
      nextMaintenance: '18d',
      temperature: 82,
      fuelConsumption: 28.1,
      efficiency: 89.2
    },
    {
      id: 3,
      name: 'Generator 3',
      status: 'warning',
      output: 98.7,
      capacity: 150,
      uptime: '3d 4h',
      nextMaintenance: '4d',
      temperature: 95,
      fuelConsumption: 22.8,
      efficiency: 78.5
    },
    {
      id: 4,
      name: 'Generator 4',
      status: 'maintenance',
      output: 0,
      capacity: 150,
      uptime: '0d 0h',
      nextMaintenance: '1d',
      temperature: 25,
      fuelConsumption: 0,
      efficiency: 0
    },
    {
      id: 5,
      name: 'Generator 5',
      status: 'offline',
      output: 0,
      capacity: 150,
      uptime: '0d 0h',
      nextMaintenance: '30d',
      temperature: 25,
      fuelConsumption: 0,
      efficiency: 0
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      message: 'Generator #3 temperature exceeding threshold',
      time: '5m ago',
      acknowledged: false,
      generator: 'Generator 3'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Substation voltage fluctuation detected',
      time: '15m ago',
      acknowledged: false
    },
    {
      id: 3,
      type: 'info',
      message: 'Scheduled maintenance for Turbine #5',
      time: '1h ago',
      acknowledged: true
    },
    {
      id: 4,
      type: 'success',
      message: 'Grid synchronization completed successfully',
      time: '2h ago',
      acknowledged: true
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      role: 'Senior Operator',
      email: 'john.smith@powerops.com',
      status: 'online',
      lastActive: 'Now',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Control Engineer',
      email: 'sarah.johnson@powerops.com',
      status: 'online',
      lastActive: '5m ago',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Mike Davis',
      role: 'Maintenance Tech',
      email: 'mike.davis@powerops.com',
      status: 'offline',
      lastActive: '2h ago',
      avatar: 'MD'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      role: 'Safety Inspector',
      email: 'lisa.chen@powerops.com',
      status: 'online',
      lastActive: '15m ago',
      avatar: 'LC'
    }
  ]);

  const updateGenerator = (id, updates) => {
    setGenerators(prev => prev.map(gen => 
      gen.id === id ? { ...gen, ...updates } : gen
    ));
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const addAlert = (alert) => {
    const newAlert = { ...alert, id: Date.now() };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const clearAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const totalOutput = generators.reduce((sum, gen) => sum + gen.output, 0);
  const totalCapacity = generators.reduce((sum, gen) => sum + gen.capacity, 0);
  const systemEfficiency = totalOutput > 0 ? (totalOutput / totalCapacity) * 100 : 0;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGenerators(prev => prev.map(gen => {
        if (gen.status === 'online') {
          const variation = (Math.random() - 0.5) * 10;
          const newOutput = Math.max(0, Math.min(gen.capacity, gen.output + variation));
          const tempVariation = (Math.random() - 0.5) * 5;
          const newTemp = Math.max(70, Math.min(100, gen.temperature + tempVariation));
          
          return {
            ...gen,
            output: Math.round(newOutput * 10) / 10,
            temperature: Math.round(newTemp),
            efficiency: Math.round((newOutput / gen.capacity) * 100 * 10) / 10
          };
        }
        return gen;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{
      generators,
      alerts,
      users,
      updateGenerator,
      acknowledgeAlert,
      addAlert,
      clearAlert,
      totalOutput,
      totalCapacity,
      systemEfficiency
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};