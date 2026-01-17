import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
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

import FullPixelInventory from "./components/Temporary Code/GooglePixel";
function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Layout>
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
              {/* readings starting from here */}
              <Route path="/readings" element={<ControlRoomReadings />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
