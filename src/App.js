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
import SOPsComponent from "./components/Knowledge Hub/SOP/SOP's.jsx";
import MillRecordForm from "./components/Daily Readings/Feeders Stoppage/Feeder-tripping.jsx";
import MillRecordsTable from "./components/Stoppage Dashboard/millstripping.jsx";
import DashboardLayout from "./pages/DashboardLayoutHours.jsx";
import EngineLogForm from "./components/Daily Readings/Egnien Start  Stop/EngineLogForm.jsx";
import MonthlyStartsStopsEntry from "./components/Daily Readings/Egnien Start  Stop/PreviousData/PreviousRecord.jsx";
import MarkAttendance from "./components/Attandance/pages/MarkAttendance.jsx";
import ProtectionsSafety from "./components/Knowledge Hub/Protections/ProtectionSafety.jsx";
import AuthPortal from "./components/Users/AuthModel.js";
import ApprovalDashboard from "./components/Users/ApprovalDashboard.jsx";
import AlertsApproval from "./components/Users/Manager Approval Dashboard/AlertsApproval.jsx";
import NotificationSetup from "./components/Notifications/NotificationSetup.js";
import SummaryViewer from "./components/From Python/SummaryViewer.jsx";
import AddSOPForm from "./components/Knowledge Hub/SOP/AddSop.jsx";
import DepartmentSOPApproval from "./components/Knowledge Hub/SOP/All Sop Files/SopAppoval.jsx";
import UnapprovedSops from "./components/Knowledge Hub/SOP/All Sop Files/UnapprovedSop.jsx";
import EngineLogTable from "./components/Stoppage Dashboard/EngineLogTable.jsx";
import AnalyzeButton from "./components/Temporary Code/AnalyzeButton.jsx";
import ExecutiveDashboard from "./components/All Dashboards/Executive Dashboard/Executive Dashboard.jsx";
import MechanicalDashboard from "./components/All Dashboards/Mechanical Dashboard/MechanicalDashboard.jsx";
import ServicesDashboard from "./components/All Dashboards/Services Dashboard/ServicesDashboard.jsx";
import UtilityDashboard from "./components/All Dashboards/Utility Dashboard/UtilityDashboard.jsx";
import ElectricalDashboard from "./components/All Dashboards/Electrical Dashboard/Electrical Dashboard.jsx";
import VideoLectures from "./components/Knowledge Hub/Video Lectures/VideoLectures.jsx";
import ImportReadings from "./components/dashboard/PowerGenerationOverview.jsx";
import PowerGenerationChart from "./components/dashboard/PowerGenerationChart.jsx";

function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "teamMembers", currentUser.uid);
          const docSnap = await getDoc(docRef);
          setUserProfile(docSnap.exists() ? docSnap.data() : null);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ Always at top level
  useEffect(() => {
    if (userProfile) {
      console.log("User Profile in App:", userProfile);
    }
  }, [userProfile]);

  const canApprove =
    userProfile?.department === "operation" &&
    (userProfile?.designation === "developer" ||
      userProfile?.designation === "MO");

  if (loadingProfile) {
    return <div>Loading user profile...</div>;
  }
  return (
    <ThemeProvider>
      <DataProvider>
        <FeedersTrippingProvider>
          <NotificationSetup />
          <Router>
            {!user ? (
              <AuthPortal onClose={() => {}} />
            ) : (
              <Layout currentUser={userProfile}>
                <Routes>
                  <Route path="/Moharram" element={<FullPixelInventory />} />

                  {/* General Manager Overview */}
                  <Route
                    path="/"
                    element={
                      userProfile?.department === "executive" &&
                      userProfile?.designation === "General Manager" ? (
                        <ExecutiveDashboard />
                      ) : (
                        <Dashboard currentUser={userProfile} />
                      )
                    }
                  />

                  {/* All Dashboards */}
                  <Route
                    path="/mechanical-Dashboard"
                    element={<MechanicalDashboard />}
                  />
                  <Route
                    path="/electrical-Dashboard"
                    element={<ElectricalDashboard />}
                  />
                  <Route
                    path="/utility-dashboard"
                    element={<UtilityDashboard />}
                  />
                  <Route
                    path="/services-Dashboard"
                    element={<ServicesDashboard />}
                  />
                  <Route path="/videoslectures" element={<VideoLectures />} />

                  {/* Other Pages */}
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
                  <Route path="/parameteranalyse" element={<AnalyzeButton />} />
                  <Route path="/summery" element={<SummaryViewer />} />

                  {/* Readings */}
                  <Route
                    path="/DashboardLayout"
                    element={<DashboardLayout />}
                  />
                  <Route
                    path="/start-stop-logs"
                    element={<EngineLogForm currentUser={userProfile} />}
                  />
                  <Route path="/enginelogtable" element={<EngineLogTable />} />
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
                  <Route
                    path="/millstripping"
                    element={<MillRecordsTable currentUser={userProfile} />}
                  />

                  {/* SOPs */}
                  <Route
                    path="/sop"
                    element={<SOPsComponent currentUser={userProfile} />}
                  />
                  <Route
                    path="/addsop"
                    element={<AddSOPForm currentUser={userProfile} />}
                  />
                  <Route
                    path="/pendingsop"
                    element={<UnapprovedSops currentUser={userProfile} />}
                  />
                  <Route
                    path="/apprvelabsop"
                    element={
                      <DepartmentSOPApproval currentUser={userProfile} />
                    }
                  />

                  {/* Engines-safety */}
                  <Route
                    path="/engines-safety"
                    element={<ProtectionsSafety />}
                  />

                  {/* Attendance */}
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
