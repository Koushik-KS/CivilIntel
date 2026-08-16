import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>CivilIntel</h1>
      <p>Development Intelligence Platform</p>

      <nav>
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/submit-request">Submit Request</NavLink>
        <NavLink to="/messaging">Messaging Integration</NavLink>
        <NavLink to="/requests">Requests</NavLink>
        <NavLink to="/hotspots">Demand Hotspots</NavLink>
        <NavLink to="/recommendations">
          Project Recommendations
        </NavLink>
        <NavLink to="/dpi-impact">DPI Impact</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;