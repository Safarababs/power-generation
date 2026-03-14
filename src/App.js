import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./components/FIrestore/firebase.js";

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
import MillRecordForm from "./components/Daily Readings/Feeders Stoppage/Feeder-tripping.jsx";
import DashboardLayout from "./pages/DashboardLayoutHours.jsx";
import EngineLogForm from "./components/Daily Readings/Egnien Start  Stop/EngineLogForm.jsx";
import MonthlyStartsStopsEntry from "./components/Daily Readings/Egnien Start  Stop/PreviousData/PreviousRecord.jsx";
import MarkAttendance from "./components/Attandance/pages/MarkAttendance.jsx";
import ProtectionsSafety from "./components/Knowledge Hub/ProtectionSafety.jsx";
import AuthModal from "./components/Users/AuthModel.js";
import ApprovalDashboard from "./components/Users/ApprovalDashboard.jsx";
import AlertsApproval from "./components/Users/Manager Approval Dashboard/AlertsApproval.jsx";
import NotificationSetup from "./components/Notifications/NotificationSetup.js";
import SummaryViewer from "./components/From Python/SummaryViewer.jsx";
import AddSOPForm from "./components/SOP/AddSop.jsx";
import MillRecordsTable from "./components/Mills Tripping Dashboard/millstripping.jsx";

function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "teamMembers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = (user) => {
    setUser(user); // update App state with the logged-in user
  };

  // ✅ Helper: who can approve
  const canApprove =
    userProfile?.department === "operation" &&
    (userProfile?.designation === "developer" ||
      userProfile?.designation === "MO");

  return (
    <ThemeProvider>
      <DataProvider>
        <FeedersTrippingProvider>
          <NotificationSetup />

          <Router>
            {!user ? (
              <AuthModal onLogin={handleLogin} onClose={() => {}} />
            ) : (
              <Layout currentUser={userProfile}>
                {/* Protected routes */}
                <Routes>
                  <Route path="/summery" exact element={<SummaryViewer />} />
                  <Route path="/Moharram" element={<FullPixelInventory />} />
                  <Route path="/" exact element={<Dashboard />} />
                  <Route path="/generation" element={<Generation />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/controls" element={<Controls />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route
                    path="/alerts"
                    element={<Alerts currentUser={userProfile} />}
                  />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* readings */}
                  <Route
                    path="/DashboardLayout"
                    element={<DashboardLayout />}
                  />

                  {/* egnine start/stop */}
                  <Route
                    path="/start-stop-logs"
                    element={<EngineLogForm currentUser={userProfile} />}
                  />
                  {/* previous start stop entry */}
                  <Route
                    path="/monthly-starts-stops"
                    element={
                      <MonthlyStartsStopsEntry currentUser={userProfile} />
                    }
                  />
                  <Route
                    path="/readings"
                    element={<ControlRoomReadings currentUser={userProfile} />}
                  />
                  <Route
                    path="/fuel-readings"
                    element={<FuelReadingsEntry currentUser={userProfile} />}
                  />
                  <Route path="/feeders" element={<FeedersTripping />} />
                  <Route path="/wash-logs" element={<WashLogForm />} />
                  <Route
                    path="/mills-tripping-record"
                    element={<MillRecordForm currentUser={userProfile} />}
                  />
                  <Route path="/millstripping" element={<MillRecordsTable />} />
                  {/* SOPs */}
                  <Route path="/sop" element={<SOPsComponent />} />
                  <Route
                    path="/addsop"
                    element={<AddSOPForm currentUser={userProfile} />}
                  />
                  {/* engines-safety */}
                  <Route
                    path="/engines-safety"
                    element={<ProtectionsSafety />}
                  />
                  {/* Attandance */}
                  <Route path="/attendance" element={<MarkAttendance />} />

                  {/* Approval dashboards */}
                  <Route
                    path="/approval-dashboard"
                    element={
                      canApprove ? (
                        <ApprovalDashboard currentUser={userProfile} />
                      ) : (
                        <p>Access denied 🚫</p>
                      )
                    }
                  />
                  <Route
                    path="/alerts-approval"
                    element={
                      canApprove ? (
                        <AlertsApproval currentUser={userProfile} />
                      ) : (
                        <p>Access denied 🚫</p>
                      )
                    }
                  />
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
