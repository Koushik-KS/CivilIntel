import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import SubmitRequest from "./pages/SubmitRequest";
import Requests from "./pages/Requests";
import Hotspots from "./pages/Hotspots";
import Recommendations from "./pages/Recommendations";
import DPIImpact from "./pages/DPIImpact";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="submit-request" element={<SubmitRequest />} />
        <Route path="requests" element={<Requests />} />
        <Route path="hotspots" element={<Hotspots />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="dpi-impact" element={<DPIImpact />} />
      
      </Route>
    </Routes>
  );
}

export default App;