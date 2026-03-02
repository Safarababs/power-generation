import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ThemeProvider } from "./components/ThemeContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";

// Pages & Components
import Dashboard from "./pages/Dashboard";
import Generation from "./pages/Generation";
import Monitoring from "./pages/Monitoring";
import Controls from "./pages/Controls";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import ControlRoomReadings from "./components/Daily Readings/ElectricalREadings.jsx";
import FuelReadingsEntry from "./components/Daily Readings/Fuel Readings/FuelReadingsEntry.jsx";
import WashLogForm from "./components/Daily Readings/Washing/Washing.jsx";
import FullPixelInventory from "./components/Temporary Code/GooglePixel";
import FeedersTripping from "./pages/Feeders Tripping.jsx";
import { FeedersTrippingProvider } from "./context/Feeders Tripping Data.jsx";
import SOPsComponent from "./components/SOP/SOP's.jsx";

// New Login Component
import LoginForm from "./components/Users/Login.jsx";
import MillRecordForm from "./components/Daily Readings/Feeders Stoppage/Feeder-tripping.jsx";
import DashboardLayout from "./pages/DashboardLayoutHours.jsx";
import EngineLogForm from "./components/Daily Readings/Egnien Start  Stop/EngineLogForm.jsx";
import MonthlyStartsStopsEntry from "./components/Daily Readings/Egnien Start  Stop/PreviousData/PreviousRecord.jsx";
import MarkAttendance from "./components/Attandance/pages/MarkAttendance.jsx";
import ProtectionsSafety from "./components/Knowledge Hub/ProtectionSafety.jsx";

function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <ThemeProvider>
      <DataProvider>
        <FeedersTrippingProvider>
          <Router>
            {!user ? (
              // Show login form if not authenticated
              <LoginForm onLogin={setUser} />
            ) : (
              <Layout>
                {/* Protected routes */}
                <Routes>
                  <Route path="/Moharram" element={<FullPixelInventory />} />
                  <Route path="/" exact element={<Dashboard />} />
                  <Route path="/generation" element={<Generation />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/controls" element={<Controls />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* readings */}
                  <Route
                    path="/DashboardLayout"
                    element={<DashboardLayout />}
                  />
                  {/* egnine start/stop */}
                  <Route path="/start-stop-logs" element={<EngineLogForm />} />
                  {/* previous start stop entry */}
                  <Route
                    path="/monthly-starts-stops"
                    element={<MonthlyStartsStopsEntry />}
                  />
                  <Route path="/readings" element={<ControlRoomReadings />} />
                  <Route
                    path="/fuel-readings"
                    element={<FuelReadingsEntry />}
                  />
                  <Route path="/feeders" element={<FeedersTripping />} />
                  <Route path="/wash-logs" element={<WashLogForm />} />
                  <Route
                    path="/mills-tripping-record"
                    element={<MillRecordForm />}
                  />
                  {/* SOPs */}
                  <Route path="/sop" element={<SOPsComponent />} />
                  {/* engines-safety */}
                  <Route
                    path="/engines-safety"
                    element={<ProtectionsSafety />}
                  />
                  {/* Attandance */}
                  <Route path="/attendance" element={<MarkAttendance />} />
                </Routes>
              </Layout>
            )}
          </Router>
        </FeedersTrippingProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
